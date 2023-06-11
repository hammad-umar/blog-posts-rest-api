import { get } from 'lodash'
import { Service } from 'typedi'
import { NextFunction, Request, Response } from 'express'
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'
import { verifyJwtToken } from '../helpers/jwt'
import { SessionService } from '../services/session.service'

@Service()
@Middleware({ type: 'before' })
export class DeserializeUserMiddleware implements ExpressMiddlewareInterface {
  constructor(private readonly sessionService: SessionService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const accessToken = get(req, 'headers.authorization', '').replace(/^Bearer\s/, '')
    const refreshToken = get(req, 'headers.x-refresh', '') as string

    if (!accessToken) return next()

    const { decoded, expired } = verifyJwtToken(accessToken)

    if (decoded) {
      res.locals.user = decoded
      return next()
    }

    if (refreshToken && expired) {
      const newAccessToken = await this.sessionService.reIssueAccessToken({ refreshToken })

      if (newAccessToken) {
        res.setHeader('x-access-token', newAccessToken as string)
      }

      const { decoded } = verifyJwtToken(newAccessToken as string)

      res.locals.user = decoded
      return next()
    }

    return next()
  }
}
