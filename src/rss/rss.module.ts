import { Module } from '@nestjs/common';

import { RssController } from './rss.controller';
import { RssService } from './rss.service';
import { xmlElementProvider } from './providers/xml-element.provider';
import { EpisodesModule } from '../episodes/episodes.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  controllers: [RssController],
  providers: [RssService, xmlElementProvider],
  imports: [EpisodesModule, SettingsModule],
})
export class RssModule {}
