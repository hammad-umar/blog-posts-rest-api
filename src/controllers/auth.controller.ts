import { Service } from 'typedi'
import {
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseBefore,
} from 'routing-controllers'
import { User } from '@prisma/client'
import { Request, Response, Express } from 'express'
import { CreateUserDto } from '../dtos/user/create-user.dto'
import { AuthService } from '../services/auth.service'
import { LoginUserDto } from '../dtos/user/login-user.dto'
import { RequireUserMiddleware } from '../middlewares/require-user.middleware'
import { UpdateUserDto } from '../dtos/user/update-user.dto'

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

  @Patch('/profile/update')
  @UseBefore(RequireUserMiddleware)
  async updateProfileDetails(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateProfileDetails(user.id, updateUserDto)
  }

  @Patch('/profile/avatar')
  @UseBefore(RequireUserMiddleware)
  async updateProfileAvatar(@UploadedFile('avatar') avatar: Express.Multer.File, @CurrentUser() user: User) {
    return this.authService.updateProfileAvatar(user.id, avatar)
  }

  @Delete('/profile/avatar')
  @UseBefore(RequireUserMiddleware)
  async deleteProfileAvatar(@CurrentUser() user: User) {
    return this.authService.deleteProfileAvatar(user.id)
  }
}
