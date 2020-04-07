import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class ConfigDatabaseDto {
  constructor(configDatabase: Partial<ConfigDatabaseDto> = {}) {
    Object.assign(this, configDatabase);
  }

  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @IsString()
  user: string;

  @IsString()
  password: string;

  @IsString()
  database: string;

  @IsBoolean()
  synchronize: boolean;

  @IsBoolean()
  autoRunMigration: boolean;

  @IsBoolean()
  logging: boolean;
}
