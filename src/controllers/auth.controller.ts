import { Service } from 'typedi'
import { Body, CurrentUser, Get, HttpCode, JsonController, Post, Req, Res, UseBefore } from 'routing-controllers'
import { CreateUserDto } from '../dtos/user/create-user.dto'
import { AuthService } from '../services/auth.service'
import { LoginUserDto } from '../dtos/user/login-user.dto'
import { Request, Response } from 'express'
import { RequireUserMiddleware } from '../middlewares/require-user.middleware'
import { User } from '@prisma/client'
import { omit } from 'lodash'

@Service()
@JsonController('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(201)
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto)
  }

  @Post('/login')
  @HttpCode(200)
  async loginUser(@Body() loginUserDto: LoginUserDto, @Req() req: Request) {
    return this.authService.login(loginUserDto, req)
  }

  @Get('/logout')
  @UseBefore(RequireUserMiddleware)
  async logout(@Res() res: Response) {
    const sessionId = res.locals.user.sessionId
    await this.authService.logout(sessionId)

    return {
      accessToken: null,
      refreshToken: null,
    }
  }

  @Get('/sessions')
  @UseBefore(RequireUserMiddleware)
  async getSessions(@Res() res: Response) {
    const userId = res.locals.user.userId
    const sessions = await this.authService.getSessions(userId)

    return sessions
  }

  @Get('/profile')
  @UseBefore(RequireUserMiddleware)
  async getProfile(@CurrentUser() user: User) {
    return user
  }
}
