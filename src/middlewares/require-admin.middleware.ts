import { get } from 'lodash'
import { Service } from 'typedi'
import { NextFunction, Request, Response } from 'express'
import { ExpressMiddlewareInterface, ForbiddenError } from 'routing-controllers'
import { UserService } from '../services/user.service'

@Service()
export class RequireAdminMiddleware implements ExpressMiddlewareInterface {
  constructor(private readonly usersService: UserService) {}

  async use(_: Request, res: Response, next: NextFunction) {
    const user = await this.usersService.findOne({ id: get(res, 'locals.user.userId', '') })

    if (user?.role !== 'ADMIN') {
      throw new ForbiddenError('Access Denied!')
    }

    return next()
  }
}
