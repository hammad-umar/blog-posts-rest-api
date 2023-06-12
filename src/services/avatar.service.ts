import { Inject, Service } from 'typedi'
import { Avatar, Prisma, PrismaClient } from '@prisma/client'
import { constants } from '../constants'

@Service()
export class AvatarService {
  constructor(@Inject(constants.PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async findOne(filterQuery: Prisma.AvatarWhereInput): Promise<Avatar | null> {
    return this.prisma.avatar.findFirst({ where: filterQuery })
  }

  async create(userId: string, publicId: string, secureUrl: string): Promise<Avatar> {
    return this.prisma.avatar.create({ data: { userId, publicId, secureUrl } })
  }

  async delete(id: string): Promise<Avatar> {
    return this.prisma.avatar.delete({ where: { id } })
  }

  async update(id: string, publicId: string, secureUrl: string): Promise<Avatar> {
    return this.prisma.avatar.update({ where: { id }, data: { publicId, secureUrl } })
  }
}
