import { Controller, Get, Header, UseFilters } from '@nestjs/common';
import { XMLSerializedValue } from 'xmlbuilder2/lib/interfaces';

import { RssService } from './rss.service';
import { SettingsNotFoundExceptionFilter } from '../settings/filters/settings-not-found-exception.filter';

@Controller('/api/rss')
export class RssController {
  public constructor(private readonly rssService: RssService) {}

  @Get()
  @UseFilters(new SettingsNotFoundExceptionFilter())
  @Header('Cache-Control', 'none')
  @Header('content-type', 'application/rss+xml')
  public async getXmlRss(): Promise<XMLSerializedValue> {
    return this.rssService.generate();
  }
}
