import { IsNumber } from 'class-validator';

export class WebServerConfigDto {
  @IsNumber()
  public port: number;

  public constructor(configDatabase: Partial<WebServerConfigDto> = {}) {
    Object.assign(this, configDatabase);
  }
}
