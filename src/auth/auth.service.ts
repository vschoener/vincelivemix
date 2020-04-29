import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthConfigService } from '../config/auth-config.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { JwtDto } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthConfigService)
    private readonly authConfigService: AuthConfigService,
    @Inject(UsersService) private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    // First time usage, even personal usage, I'd to create a admin user in a proper
    // way, so this will help doing this
    if (this.isSuperAdmin(email, password)) {
      return new User({
        firstName: 'Admin',
        lastName: 'Admin',
        isSuperAdmin: true,
        roles: ['Admin'],
        id: 0,
        email: 'none',
      });
    }

    const user = await this.usersService.findUserByEmail(email);

    return user && (await bcrypt.compare(password, user.encodedPassword))
      ? user
      : null;
  }

  public isSuperAdmin(username: string, password: string): boolean {
    const {
      isSuperAdminUserEnabled,
      superAdminUser,
      superAdminPassword,
    } = this.authConfigService.get();
    if (isSuperAdminUserEnabled) {
      return username === superAdminUser && password === superAdminPassword;
    }

    return false;
  }

  public authenticateWithJwt(user: User) {
    const payload: JwtDto = {
      roles: user.roles,
      sub: user.id,
      isSuperAdmin: user.isSuperAdmin,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
