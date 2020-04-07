import { ItunesService } from './itunes.service';
import {
  Body,
  Controller,
  Get,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ItunesSettingsDto } from './dto/itunes-settings.dto';

@Controller('/itunes')
export class ItunesController {
  constructor(private readonly itunesService: ItunesService) {}

  @Get()
  public async getSettings() {
    return this.itunesService.getSettings();
  }

  @Put()
  @UsePipes(ValidationPipe)
  public async createOrUpdate(@Body() payload: ItunesSettingsDto) {
    return this.itunesService.createOrUpdate(payload);
  }
}
