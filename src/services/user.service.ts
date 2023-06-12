import { Inject, Service } from 'typedi'
import { Prisma, PrismaClient, User } from '@prisma/client'
import { constants } from '../constants'
import { CreateUserDto } from '../dtos/user/create-user.dto'
import { UpdateUserDto } from '../dtos/user/update-user.dto'

@Service()
export class UserService {
  constructor(@Inject(constants.PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async find(): Promise<User[]> {
    return this.prisma.user.findMany()
  }

  async findOne(filterQuery: Prisma.UserWhereInput): Promise<User | null> {
    return this.prisma.user.findFirst({ where: filterQuery })
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: createUserDto })
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } })
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: updateUserDto })
  }
}
