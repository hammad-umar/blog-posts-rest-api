import { NextFunction, Request, Response } from 'express'
import { ExpressMiddlewareInterface, ForbiddenError } from 'routing-controllers'
import { Service } from 'typedi'

@Service()
export class RequireUserMiddleware implements ExpressMiddlewareInterface {
  use(_: Request, res: Response, next: NextFunction) {
    const user = res.locals.user

    if (!user) {
      throw new ForbiddenError('Access Denied!')
    }

    return next()
  }
}
