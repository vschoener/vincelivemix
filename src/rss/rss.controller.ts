import { Controller, Get, Header } from '@nestjs/common';
import { RssService } from './rss.service';

@Controller('/rss')
export class RssController {
  public constructor(private readonly rssService: RssService) {}

  @Get()
  @Header('Cache-Control', 'none')
  public get(): string {
    return this.rssService.generate();
  }
}
