import { Controller, Get, Header, Post, UseFilters } from '@nestjs/common';
import { XMLSerializedValue } from 'xmlbuilder2/lib/interfaces';

import { RssService } from './rss.service';
import { SettingsNotFoundExceptionFilter } from '../shared/settings/filters/settings-not-found-exception.filter';

@Controller('/api/rss')
export class RssController {
  public constructor(private readonly rssService: RssService) {}

  @UseFilters(new SettingsNotFoundExceptionFilter())
  @Get()
  @Header('Cache-Control', 'none')
  @Header('content-type', 'application/rss+xml')
  public async getXmlRss(): Promise<XMLSerializedValue> {
    return this.rssService.generate();
  }
}
