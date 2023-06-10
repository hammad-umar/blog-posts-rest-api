import { Service } from 'typedi'
import { Body, JsonController, Post } from 'routing-controllers'
import { CreateUserDto } from '../dtos/user/create-user.dto'
import { AuthService } from '../services/auth.service'

@Service()
@JsonController('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto)
  }
}
