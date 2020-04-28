import { Module } from '@nestjs/common';
import { DatabaseConfigService } from './database-config.service';
import * as dotenv from 'dotenv';
import { ConfigLoaderService } from './config-loader.service';

dotenv.config();

@Module({
  providers: [DatabaseConfigService, ConfigLoaderService],
  exports: [DatabaseConfigService],
})
export class ConfigModule {}
