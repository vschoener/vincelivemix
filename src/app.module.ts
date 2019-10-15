import { Module } from '@nestjs/common';
import { RssModule } from './rss/rss.module';
import { EpisodesModule } from './episodes/episodes.module';

@Module({
  imports: [RssModule, EpisodesModule],
})
export class AppModule {}
