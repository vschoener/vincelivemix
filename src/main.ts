import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { loggerSettings } from './core/logger/logger.settings';
import { WebServerConfigDto } from './config/dto/web-server-config.dto';

async function bootstrap() {
  const logger = WinstonModule.createLogger(loggerSettings);
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  const { port } = app.get(WebServerConfigDto);
  await app.listen(port);
  logger.log(`Server running on port :${port}`);
}
bootstrap();
