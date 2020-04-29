import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class AuthConfigDto {
  constructor(configDatabase: Partial<AuthConfigDto> = {}) {
    Object.assign(this, configDatabase);
  }

  @IsString()
  privateKey: string;

  @IsNumber()
  lifetime: number;

  @IsString()
  superAdminUser: string;

  @IsString()
  superAdminPassword: string;

  @IsBoolean()
  isSuperAdminUserEnabled: boolean;
}
