import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { ConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthConfigDto } from '../config/dto/auth-config.dto';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (
        authConfigDto: AuthConfigDto,
      ): Promise<JwtModuleOptions> => {
        const { privateKey, lifetime } = authConfigDto;

        return {
          secret: privateKey,
          signOptions: {
            expiresIn: `${lifetime}s`,
          },
        };
      },
      inject: [AuthConfigDto],
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
