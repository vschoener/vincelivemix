import { Controller, Get, Header } from '@nestjs/common';
import { RssService } from './rss.service';
import { XMLSerializedValue } from 'xmlbuilder2/lib/interfaces';

@Controller('/rss')
export class RssController {
  public constructor(private readonly rssService: RssService) {}

  @Get()
  @Header('Cache-Control', 'none')
  public get(): Promise<XMLSerializedValue> {
    return this.rssService.generate();
  }
}
