import { Module } from '@nestjs/common';
import { ConfigDatabaseService } from './config-database.service';
import { Logger } from 'winston';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  providers: [
    {
      provide: ConfigDatabaseService,
      useFactory: async (logger: Logger) => {
        return await new ConfigDatabaseService(logger).load();
      },
      inject: ['winston'],
    },
  ],
  exports: [ConfigDatabaseService]
})
export class ConfigModule {}
