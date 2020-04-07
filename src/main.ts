import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

// Shitty way to load the conf asap, need a config service
dotenv.config();

import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { loggerSettings } from './core/logger/logger.settings';

async function bootstrap() {
  const logger = WinstonModule.createLogger(loggerSettings);
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  // quick and dirty approach while getting a real config service
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Server running on port :${port}`);
}
bootstrap();
