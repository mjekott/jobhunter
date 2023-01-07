import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { Role } from './../../../../user/src/lib/schema/user.schema'

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email address' })
  readonly email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string

  @IsOptional()
  @IsEnum(Role, { message: 'Please enter correct Role option' })
  readonly role: Role
}
