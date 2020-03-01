import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';

import { RssModule } from './rss/rss.module';
import { EpisodesModule } from './episodes/episodes.module';
import * as typeOrmConfig from './config/typeorm.config';
import { CoreModule } from './core/core.module';
import { loggerSettings } from './core/logger/logger.settings';

@Module({
  imports: [
    CoreModule,
    TypeOrmCoreModule.forRoot(typeOrmConfig),
    WinstonModule.forRoot(loggerSettings),
    RssModule,
    EpisodesModule,
  ],
})
export class AppModule {}
