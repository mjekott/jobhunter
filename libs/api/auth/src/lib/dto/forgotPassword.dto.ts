import { IsEmail, IsNotEmpty } from 'class-validator'

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email address' })
  readonly email: string
}
