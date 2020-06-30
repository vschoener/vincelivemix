import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class DatabaseConfigDto {
  @IsString()
  public host: string;

  @IsNumber()
  public port: number;

  @IsString()
  public user: string;

  @IsString()
  public password: string;

  @IsString()
  public database: string;

  @IsBoolean()
  public synchronize: boolean;

  @IsBoolean()
  public autoRunMigration: boolean;

  @IsBoolean()
  public logging: boolean;

  @IsNumber()
  public retriesNumber: number;

  public constructor(configDatabase: Partial<DatabaseConfigDto> = {}) {
    Object.assign(this, configDatabase);
  }
}
