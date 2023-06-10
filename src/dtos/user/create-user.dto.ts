import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'First name must contain 2 characters!' })
  firstName: string

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Last name must contain 8 characters!' })
  lastName: string

  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must contain 8 characters!' })
  password: string
}
