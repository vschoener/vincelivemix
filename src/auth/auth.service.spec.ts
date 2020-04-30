import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthConfigDto } from '../config/dto/auth-config.dto';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const authConfigService = {
      provide: AuthConfigDto,
      useValue: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: jest.fn(),
        },
        {
          provide: AuthConfigDto,
          useValue: authConfigService,
        },
        {
          provide: UsersService,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
