import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';

import { SettingsService } from './settings.service';
import { SettingsNotFoundExceptionFilter } from './filters/settings-not-found-exception.filter';
import { ResponsesSettingsDto } from './type/responses.type';

@Controller('/api/settings')
export class SettingsController {
  public constructor(private readonly settingsService: SettingsService) {}

  @Get('/:name')
  @UseFilters(new SettingsNotFoundExceptionFilter())
  public async getSettings<T extends string>(
    @Param('name') name: T,
  ): Promise<ResponsesSettingsDto> {
    return this.settingsService.getSetting(name);
  }

  @Post('/:name')
  @UseFilters(new SettingsNotFoundExceptionFilter())
  @HttpCode(200)
  public async createOrUpdateSettings<T extends ResponsesSettingsDto>(
    @Param('name') name: string,
    @Body() payload: T,
  ): Promise<T> {
    return this.settingsService.createOrUpdate(name, payload);
  }
}
