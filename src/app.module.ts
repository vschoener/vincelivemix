import { Module } from '@nestjs/common';
import { RssModule } from './rss/rss.module';
import { EpisodesModule } from './episodes/episodes.module';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import * as typeOrmConfig from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmCoreModule.forRoot(typeOrmConfig),
    RssModule,
    EpisodesModule,
  ],
})
export class AppModule {}
