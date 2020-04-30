import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtDto } from './dto/jwt.dto';
import { AuthConfigDto } from '../config/dto/auth-config.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private authConfig: AuthConfigDto) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.privateKey,
    });
  }

  public async validate(payload: JwtDto) {
    return { userId: payload.sub, roles: payload.roles };
  }
}
