import { Module } from '@nestjs/common';
import { DatabaseConfigService } from './database-config.service';
import * as dotenv from 'dotenv';
import { ConfigLoaderService } from './config-loader.service';
import { AuthConfigService } from './auth-config.service';
import { Logger } from 'winston';

dotenv.config();

@Module({
  providers: [
    DatabaseConfigService,
    ConfigLoaderService,
    // Unfortunately, no cleaner way to load the config properly
    // OnModuleInit need all App Module to be loaded and we
    // use config to load during Module injection
    {
      provide: AuthConfigService,
      useFactory: async (
        configLoaderService: ConfigLoaderService,
        logger: Logger,
      ) => {
        const config = new AuthConfigService(configLoaderService, logger);
        await config.load();

        return config;
      },
      inject: [ConfigLoaderService, 'winston'],
    },
  ],
  exports: [DatabaseConfigService, AuthConfigService],
})
export class ConfigModule {}
