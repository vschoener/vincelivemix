import { DynamicModule, FactoryProvider, Global, Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Logger } from 'winston';

dotenv.config();

import { ConfigLoaderService } from './config-loader.service';
import { DatabaseConfigDto } from './dto/database-config.dto';
import { WebServerConfigDto } from './dto/web-server-config.dto';
import { databaseConfigDto } from './configs/database-config';
import { webServerConfigDto } from './configs/web-server.config';

@Global()
@Module({})
export class ConfigModule {
  public static forRoot(): DynamicModule {
    const configs = [
      new DatabaseConfigDto(databaseConfigDto),
      new WebServerConfigDto(webServerConfigDto),
    ];

    const providers: FactoryProvider[] = configs.map((config) => ({
      provide: config.constructor,
      useFactory: async (logger: Logger) => {
        const configLoader = new ConfigLoaderService<typeof config>(logger);
        return (await configLoader.load(config)).get();
      },
      inject: ['winston'],
    }));

    return {
      module: ConfigModule,
      providers,
      exports: providers,
    };
  }
}
