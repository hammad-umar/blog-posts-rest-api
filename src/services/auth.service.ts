import { Inject, Service } from 'typedi'
import { PrismaClient, User } from '@prisma/client'
import { HttpError } from 'routing-controllers'
import { genSalt, hash } from 'bcryptjs'
import { constants } from '../constants'
import { CreateUserDto } from '../dtos/user/create-user.dto'

@Service()
export class AuthService {
  constructor(@Inject(constants.PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

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
}
