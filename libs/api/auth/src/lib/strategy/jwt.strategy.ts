import { UserService } from '@jobhunter/api/user'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_TOKEN,
    })
  }

  async validate(id: string) {
    const user = await this.userService.findById(id)

    if (!user) {
      throw new UnauthorizedException('Login first to access this resource.')
    }

    return user
  }
}
