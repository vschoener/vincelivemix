import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class AuthConfigDto {
  @IsString()
  public privateKey: string;

  @IsNumber()
  public lifetime: number;

  @IsString()
  public superAdminUser: string;

  @IsString()
  public superAdminPassword: string;

  @IsBoolean()
  public isSuperAdminUserEnabled: boolean;

  public constructor(configDatabase: Partial<AuthConfigDto> = {}) {
    Object.assign(this, configDatabase);
  }
}
