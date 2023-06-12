import { omit } from 'lodash'
import { Request } from 'express'
import { Service } from 'typedi'
import { compare, genSalt, hash } from 'bcryptjs'
import { Avatar, Session, User } from '@prisma/client'
import { HttpError, NotFoundError, UnauthorizedError } from 'routing-controllers'
import { generateJwtToken } from '../helpers/jwt'
import { SessionService } from './session.service'
import { LoginUserDto } from '../dtos/user/login-user.dto'
import { CreateUserDto } from '../dtos/user/create-user.dto'
import { ILoginResponse } from '../interfaces/login-response.interface'
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL, SALT_WORK_FACTOR } from '../env'
import { UserService } from './user.service'
import { AvatarService } from './avatar.service'
import { CloudinaryService } from '../common/services/cloudinary.service'
import { UpdateUserDto } from '../dtos/user/update-user.dto'

@Service()
export class AuthService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly usersService: UserService,
    private readonly avatarsService: AvatarService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersService.findOne({
      email: createUserDto.email,
    })

    if (existingUser) {
      throw new HttpError(409, 'Email is already taken!')
    }

    const saltOrRounds = await genSalt(SALT_WORK_FACTOR)
    const hashedPassword = await hash(createUserDto.password, saltOrRounds)

    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    })

    return omit(user, 'password')
  }

  async login(loginUserDto: LoginUserDto, req: Request): Promise<ILoginResponse> {
    const { email, password } = loginUserDto

    const user = await this.usersService.findOne({ email })

    if (!user) {
      throw new UnauthorizedError('Invalid Credentials!')
    }

    const isPasswordMatch = await compare(password, user.password)

    if (!isPasswordMatch) {
      throw new UnauthorizedError('Invalid Credentials!')
    }

    const session = await this.sessionService.create(user.id, req.get('user-agent') || '')

    const accessToken = generateJwtToken(
      { userId: user.id, sessionId: session.id },
      {
        expiresIn: ACCESS_TOKEN_TTL,
      },
    )

    const refreshToken = generateJwtToken(
      { userId: user.id, sessionId: session.id },
      {
        expiresIn: REFRESH_TOKEN_TTL,
      },
    )

    return { accessToken, refreshToken }
  }

  async logout(sessionId: string): Promise<Session> {
    return this.sessionService.update(sessionId, { valid: false })
  }

  async getSessions(userId: string): Promise<Session[]> {
    return this.sessionService.find({ userId, valid: true })
  }

  async updateProfileDetails(userId: string, updates: UpdateUserDto): Promise<User> {
    return this.usersService.update(userId, updates)
  }

  async updateProfileAvatar(userId: string, avatar: Express.Multer.File): Promise<Avatar | undefined> {
    // Check if the avatar is already exist or not
    const existingAvatar = await this.avatarsService.findOne({ userId })

    // If avatar exist
    if (existingAvatar) {
      // then, remove old avatar from cloudinary and upload new avatar.
      await this.cloudinaryService.delete(existingAvatar.publicId)
      const uploadedAvatar = await this.cloudinaryService.upload(avatar)
      // and update the avatar in the database.

      const updatedAvatar =
        uploadedAvatar &&
        (await this.avatarsService.update(existingAvatar.id, uploadedAvatar.public_id, uploadedAvatar?.secure_url))

      return updatedAvatar
    }

    // If avatar not exist
    // then, upload avatar to the cloudinary.
    const uploadedAvatar = await this.cloudinaryService.upload(avatar)
    // and create a new avatar in the database.
    const newAvatar =
      uploadedAvatar && (await this.avatarsService.create(userId, uploadedAvatar.public_id, uploadedAvatar.secure_url))

    return newAvatar
  }

  async deleteProfileAvatar(userId: string): Promise<Avatar> {
    const avatar = await this.avatarsService.findOne({ userId })

    if (!avatar) {
      throw new NotFoundError('Avatar not found!')
    }

    await this.cloudinaryService.delete(avatar.publicId)
    return this.avatarsService.delete(avatar.id)
  }
}
