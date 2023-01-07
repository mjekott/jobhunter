import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Throttle, ThrottlerGuard } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators'
import { Public } from './decorators/public.decorator'
import { ForgotPasswordDto } from './dto/forgotPassword.dto'
import { LoginDto } from './dto/login.dto'
import { SignUpDto } from './dto/signup.dto'
import { VerifyCodeDto } from './dto/verifyCode.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto, @Res({ passthrough: true }) response) {
    const { token, refresh, user } = await this.authService.signUp(signUpDto)

    response.cookie('refreshToken', refresh, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 100,
      secure: process.env.NODE_ENV === 'production',
      path: '/api/auth/refresh',
    })

    return { token, user }
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 300)
  @Public()
  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response) {
    const { token, refresh, user } = await this.authService.login(loginDto)

    response.cookie('refreshToken', refresh, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 100,
      secure: process.env.NODE_ENV === 'production',
      path: '/api/auth/refresh',
    })

    return { token, user }
  }

  @Get('/me')
  async me(@CurrentUser() user) {
    return user
  }

  @Get('/logout')
  async logout(@Res({ passthrough: true }) response) {
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/api/auth/refresh',
    })

    return { ok: true }
  }

  @Public()
  @Get('/refresh')
  async refresh(@Req() request) {
    return await this.authService.refresh(request.cookies.refreshToken)
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 300)
  @Public()
  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email)
    return { ok: true }
  }

  @Public()
  @Post('/verify-otp')
  async verify(@Body() verifyCodeDto: VerifyCodeDto) {
    await this.authService.changePassword(verifyCodeDto.code, verifyCodeDto.password)
    return { ok: true }
  }
}
