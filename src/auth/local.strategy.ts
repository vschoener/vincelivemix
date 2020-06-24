import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
// eslint-disable-next-line
import { Strategy } from 'passport-local'; //  Strategy is exported from node module but wrong in type
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private authService: AuthService) {
    super();
  }

  public async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
