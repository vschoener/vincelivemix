import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';

import { RssModule } from './rss/rss.module';
import { EpisodesModule } from './episodes/episodes.module';
import { CoreModule } from './core/core.module';
import { loggerSettings } from './core/logger/logger.settings';
import { ItunesModule } from './itunes/itunes.module';
import { ConfigModule } from './core/config/config.module';
import { ConfigDatabaseService } from './core/config/config-database.service';

@Module({
  imports: [
    CoreModule,
    TypeOrmCoreModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigDatabaseService],
      useFactory: async (configService: ConfigDatabaseService) => {
        return ConfigDatabaseService.getTypeORMConfig(configService.get());
      }
    }),
    WinstonModule.forRoot(loggerSettings),
    RssModule,
    EpisodesModule,
    ItunesModule,
  ],
})
export class AppModule {}
