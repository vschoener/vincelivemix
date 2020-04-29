import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { AuthConfigService } from '../config/auth-config.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        authConfigService: AuthConfigService,
      ): Promise<JwtModuleOptions> => {
        const { privateKey, lifetime } = authConfigService.get();

        return {
          secret: privateKey,
          signOptions: {
            expiresIn: `${lifetime}s`,
          },
        };
      },
      inject: [AuthConfigService],
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
