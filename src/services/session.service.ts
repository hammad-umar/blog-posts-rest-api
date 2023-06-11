import { Inject, Service } from 'typedi'
import { get } from 'lodash'
import { PrismaClient, Session, Prisma } from '@prisma/client'
import { constants } from '../constants'
import { generateJwtToken, verifyJwtToken } from '../helpers/jwt'
import { ACCESS_TOKEN_TTL } from '../env'

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

  async update(sessionId: string, updateQuery: Prisma.SessionUpdateInput): Promise<Session> {
    return this.prisma.session.update({ where: { id: sessionId }, data: updateQuery })
  }

  async reIssueAccessToken({ refreshToken }: { refreshToken: string }): Promise<string | boolean> {
    const { decoded } = verifyJwtToken(refreshToken)

    if (!decoded || !get(decoded, 'sessionId')) return false

    const session = await this.prisma.session.findUnique({
      where: {
        id: get(decoded, 'sessionId'),
      },
    })

    if (!session || !session.valid) return false

    const user = await this.prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    })

    if (!user) return false

    const accessToken = generateJwtToken(
      { userId: user.id, sessionId: session.id },
      {
        expiresIn: ACCESS_TOKEN_TTL,
      },
    )

    return accessToken
  }
}
