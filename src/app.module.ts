import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';

import { RssModule } from './rss/rss.module';
import { EpisodesModule } from './episodes/episodes.module';
import { CoreModule } from './core/core.module';
import { loggerSettings } from './core/logger/logger.settings';
import { ItunesModule } from './itunes/itunes.module';
import { ConfigModule } from './config/config.module';
import { DatabaseConfigService } from './config/database-config.service';

@Module({
  imports: [
    WinstonModule.forRoot(loggerSettings),
    ConfigModule,
    CoreModule,
    TypeOrmCoreModule.forRootAsync({
      imports: [ConfigModule],
      inject: [DatabaseConfigService],
      useFactory: async (configService: DatabaseConfigService) => {
        const config = (await configService.load()).get();
        return DatabaseConfigService.getTypeORMConfig(config);
      },
    }),
    RssModule,
    EpisodesModule,
    ItunesModule,
  ],
})
export class AppModule {}
