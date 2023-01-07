import { IsNotEmpty, IsString, Length } from 'class-validator'

export class VerifyCodeDto {
  @IsNotEmpty()
  @Length(8)
  @IsString()
  readonly password: string

  @IsNotEmpty()
  @IsString({ message: 'Please enter a 4 digit code' })
  readonly code: string
}
