import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class DatabaseConfigDto {
  @IsString()
  public type = 'postgres';

  @IsString()
  public url: string;

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
