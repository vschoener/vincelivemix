import { IsNumber } from 'class-validator';

export class WebServerConfigDto {
  constructor(configDatabase: Partial<WebServerConfigDto> = {}) {
    Object.assign(this, configDatabase);
  }

  @IsNumber()
  port: number;
}
