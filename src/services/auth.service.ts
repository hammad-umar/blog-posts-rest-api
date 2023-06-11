import { Inject, Service } from 'typedi'
import { PrismaClient, Session, User } from '@prisma/client'
import { HttpError, UnauthorizedError } from 'routing-controllers'
import { compare, genSalt, hash } from 'bcryptjs'
import { constants } from '../constants'
import { CreateUserDto } from '../dtos/user/create-user.dto'
import { SessionService } from './session.service'
import { LoginUserDto } from '../dtos/user/login-user.dto'
import { Request } from 'express'
import { generateJwtToken } from '../helpers/jwt'
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../env'
import { ILoginResponse } from '../interfaces/login-response.interface'

@Service()
export class AuthService {
  constructor(
    @Inject(constants.PRISMA_CLIENT) private readonly prisma: PrismaClient,
    private readonly sessionService: SessionService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    })

    if (user) {
      throw new HttpError(409, 'Email is already taken!')
    }

    const saltOrRounds = await genSalt(10)
    const hashedPassword = await hash(createUserDto.password, saltOrRounds)

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isEmailVerfied: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async login(loginUserDto: LoginUserDto, req: Request): Promise<ILoginResponse> {
    const { email, password } = loginUserDto

    // Check user's email
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedError('Invalid Credentials!')
    }

    // Check user's password
    const isPasswordMatch = await compare(password, user.password)

    if (!isPasswordMatch) {
      throw new UnauthorizedError('Invalid Credentials!')
    }

    // Create session
    const session = await this.sessionService.create(user.id, req.get('user-agent') || '')

    // Generate access token
    const accessToken = generateJwtToken(
      { userId: user.id, sessionId: session.id },
      {
        expiresIn: ACCESS_TOKEN_TTL,
      },
    )

    // Generate refresh token
    const refreshToken = generateJwtToken(
      { userId: user.id, sessionId: session.id },
      {
        expiresIn: REFRESH_TOKEN_TTL,
      },
    )

    // return access & refresh token
    return { accessToken, refreshToken }
  }

  async getSessions(userId: string): Promise<Session[]> {
    return this.sessionService.find({ userId, valid: true })
  }
}
