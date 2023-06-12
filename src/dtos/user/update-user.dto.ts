import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'First name must contain 2 characters!' })
  @IsOptional()
  firstName?: string

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Last name must contain 8 characters!' })
  @IsOptional()
  lastName?: string
}
