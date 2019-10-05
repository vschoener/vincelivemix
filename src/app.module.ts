import { Module } from '@nestjs/common';
import { RssController } from './rss/rss.controller';
import { RssService } from './rss/rss.service';

@Module({
  imports: [],
  controllers: [RssController],
  providers: [RssService],
})
export class AppModule {}
