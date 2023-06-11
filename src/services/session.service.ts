import { Inject, Service } from 'typedi'
import { constants } from '../constants'
import { PrismaClient, Session, Prisma } from '@prisma/client'

@Service()
export class SessionService {
  constructor(@Inject(constants.PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async create(userId: string, userAgent?: string): Promise<Session> {
    return this.prisma.session.create({
      data: {
        userId,
        userAgent: userAgent ? userAgent : null,
      },
    })
  }

  async find(filterQuery: Prisma.SessionWhereInput): Promise<Session[]> {
    return this.prisma.session.findMany({ where: filterQuery })
  }
}
