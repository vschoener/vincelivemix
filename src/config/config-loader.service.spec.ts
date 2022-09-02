import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';

import { DatabaseConfigDto } from './dto/database-config.dto';
import { loggerSettings } from '../core/logger/logger.settings';
import { ConfigLoaderService } from './config-loader.service';
import { ConfigValidationException } from './exceptions/config-validation.exception';
import { ConfigNotInitializedException } from './exceptions/config-not-initialized.exception';

describe('ConfigLoaderService', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore unkown is wrong. Need to put the right type with class used
  let configLoaderService: ConfigLoaderService<unknown>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WinstonModule.forRoot(loggerSettings)],
      providers: [ConfigLoaderService],
    }).compile();

    configLoaderService = await module.resolve(ConfigLoaderService);
  });

  describe('load', () => {
    it('should load a validated config', async () => {
      const databaseConfigDto = new DatabaseConfigDto({
        retriesNumber: 100,
        autoRunMigration: false,
        logging: true,
        synchronize: true,
        type: 'postgres',
        url: 'postgres_url',
      });

      await configLoaderService.load(databaseConfigDto);
    });

    it('should throw an exception with invalid config', async () => {
      const databaseConfigDto = new DatabaseConfigDto({
        retriesNumber: 100,
        autoRunMigration: false,
        logging: true,
        synchronize: true,
        type: 'postgres',
        url: 1 as unknown as string,
      });

      await expect(
        configLoaderService.load(databaseConfigDto),
      ).rejects.toThrowError(
        new ConfigValidationException('Configuration is not valid'),
      );
    });
  });

  describe('get', () => {
    it('should return the config', async () => {
      const databaseConfigDto = new DatabaseConfigDto({
        retriesNumber: 100,
        autoRunMigration: false,
        logging: true,
        synchronize: true,
        type: 'postgres',
        url: 'postgres_url',
      });

      expect((await configLoaderService.load(databaseConfigDto)).get()).toEqual(
        databaseConfigDto,
      );
    });

    it('should thrown an exception if config has not been loaded', () => {
      expect(() => configLoaderService.get()).toThrow(
        new ConfigNotInitializedException(`Configuration not loaded`),
      );
    });
  });
});
