import { Controller, Get, Header, Post } from '@nestjs/common';
import { RssService } from './rss.service';
import { XMLSerializedValue } from 'xmlbuilder2/lib/interfaces';

@Controller('/api/rss')
export class RssController {
  public constructor(private readonly rssService: RssService) {}

  @Post()
  public async generate(): Promise<XMLSerializedValue> {
    // TODO: Save generated content to a file
    return this.rssService.generate();
  }

  @Get()
  @Header('Cache-Control', 'none') // This content could be cached
  public async getCurrent() : Promise<XMLSerializedValue> {
    // TODO: Read from a generated file or 404 if not already generated
    return this.rssService.generate();
  }
}
