import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';

import { RssModule } from './rss/rss.module';
import { EpisodesModule } from './episodes/episodes.module';
import { CoreModule } from './core/core.module';
import { loggerSettings } from './core/logger/logger.settings';
import { ConfigModule } from './config/config.module';
import { DatabaseConfigService } from './config/database-config.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseConfigDto } from './config/dto/database-config.dto';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    WinstonModule.forRoot(loggerSettings),
    ConfigModule.forRoot(),
    CoreModule,
    TypeOrmCoreModule.forRootAsync({
      useFactory: async (databaseConfigDto: DatabaseConfigDto) => {
        return DatabaseConfigService.getTypeORMConfig(databaseConfigDto);
      },
      inject: [DatabaseConfigDto],
    }),
    RssModule,
    EpisodesModule,
    AuthModule,
    UsersModule,
    SettingsModule,
  ],
})
export class AppModule {}
