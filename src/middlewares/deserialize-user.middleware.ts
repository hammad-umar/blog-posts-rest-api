import { get } from 'lodash'
import { Service } from 'typedi'
import { NextFunction, Request, Response } from 'express'
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'
import { verifyJwtToken } from '../helpers/jwt'

@Service()
@Middleware({ type: 'before' })
export class DeserializeUserMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = get(req, 'headers.authorization', '').replace(/^Bearer\s/, '')

    if (!accessToken) {
      return next()
    }

    const { decoded } = verifyJwtToken(accessToken)

    if (decoded) {
      res.locals.user = decoded
      return next()
    }

    return next()
  }
}
