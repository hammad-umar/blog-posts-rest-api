import { Inject, Service } from 'typedi'
import { get } from 'lodash'
import { PrismaClient, Session, Prisma } from '@prisma/client'
import { constants } from '../constants'
import { generateJwtToken, verifyJwtToken } from '../helpers/jwt'
import { ACCESS_TOKEN_TTL } from '../env'
import { UserService } from './user.service'

@Service()
export class SessionService {
  constructor(
    @Inject(constants.PRISMA_CLIENT) private readonly prisma: PrismaClient,
    private readonly usersService: UserService,
  ) {}

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

  async findOne(id: string): Promise<Session | null> {
    return this.prisma.session.findUnique({ where: { id } })
  }

  async update(sessionId: string, updateQuery: Prisma.SessionUpdateInput): Promise<Session> {
    return this.prisma.session.update({ where: { id: sessionId }, data: updateQuery })
  }

  async reIssueAccessToken({ refreshToken }: { refreshToken: string }): Promise<string | boolean> {
    const { decoded } = verifyJwtToken(refreshToken)

    const sessionId = get(decoded, 'sessionId')

    if (!decoded || !sessionId) return false

    const session = await this.findOne(sessionId)

    if (!session || !session.valid) return false

    const user = await this.usersService.findOne({ id: session.userId })

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
