import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SignUpDto } from './dto/signup.dto'

import { UserService } from '@jobhunter/api/user'
import { JwtService } from '@nestjs/jwt'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Register User
  async signUp(signUpDto: SignUpDto) {
    const foundUser = await this.userService.findOne(signUpDto.email)
    if (foundUser) {
      throw new BadRequestException(`Email is already taken`)
    }

    const user = await this.userService.create(signUpDto)
    const token = await this.generateAccessToken(user.id)
    const refresh = await this.generateRefreshToken(user.id)

    return { token, refresh, user }
  }

  // Login user
  async login(loginDto: LoginDto) {
    const user = await this.userService.findOne(loginDto.email, '+password')
    if (!user || !(await user.comparePassword(loginDto.password))) {
      throw new BadRequestException(`Invalid Credentials`)
    }

    const token = await this.generateAccessToken(user.id)
    const refresh = await this.generateRefreshToken(user.id)

    return { token, refresh, user }
  }

  async refresh(refresh: string | null) {
    if (!refresh) {
      throw new UnauthorizedException('Login first to access this resource.')
    }

    const decoded = await this.jwtService.verify(refresh, {
      secret: this.configService.get('JWT_REFRESH_TOKEN'),
    })

    if (!decoded) {
      throw new UnauthorizedException('Invalid token')
    }

    const user = await this.userService.findById(decoded)
    if (!user) {
      throw new BadRequestException('Server error')
    }
    const token = await this.generateAccessToken(user.id)

    return { token }
  }

  private async generateAccessToken(id: string) {
    return this.jwtService.sign(id)
  }

  private async generateRefreshToken(id: string) {
    return this.jwtService.sign(id, {
      secret: this.configService.get('JWT_REFRESH_TOKEN'),
    })
  }
}
