import { Module } from '@nestjs/common';

import { RssController } from './rss.controller';
import { RssService } from './rss.service';
import { xmlElementProvider } from './providers/xml-element.provider';
import { EpisodesModule } from '../episodes/episodes.module';

@Module({
  controllers: [RssController],
  providers: [
    RssService,
    xmlElementProvider
  ],
  imports: [EpisodesModule]
})
export class RssModule {}
