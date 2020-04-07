import { Module } from '@nestjs/common';

import { RssController } from './rss.controller';
import { RssService } from './rss.service';
import { xmlElementProvider } from './providers/xml-element.provider';
import { EpisodesModule } from '../episodes/episodes.module';
import { ItunesModule } from '../itunes/itunes.module';

@Module({
  controllers: [RssController],
  providers: [RssService, xmlElementProvider],
  imports: [EpisodesModule, ItunesModule],
})
export class RssModule {}
