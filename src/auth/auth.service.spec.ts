import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthConfigService } from '../config/auth-config.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const authConfigService = {
      provide: AuthConfigService,
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
          provide: AuthConfigService,
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
