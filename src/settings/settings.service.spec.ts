import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SettingsService } from './settings.service';
import { Settings } from './entity/settings.entity';
import { SettingsNotFoundException } from './exception/settings-not-found.exception';
import { loggerSettings } from '../core/logger/logger.settings';

type TestSettings = {
  a: string;
  b: number;
};

describe('SettingsService', () => {
  let settingsService: SettingsService;
  let settingsRepository: jest.Mocked<Repository<Settings>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WinstonModule.forRoot(loggerSettings)],
      providers: [
        SettingsService,
        {
          provide: getRepositoryToken(Settings),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    settingsService = module.get(SettingsService);
    settingsRepository = module.get(getRepositoryToken(Settings));
  });

  describe('getSetting', () => {
    it('should return settings when found', async () => {
      const settings = new Settings<TestSettings>({
        name: 'custom',
        values: {
          a: 'test',
          b: 42,
        },
      });

      settingsRepository.findOne.mockResolvedValue(settings);

      expect(await settingsService.getSetting<TestSettings>('custom')).toEqual(
        settings.values,
      );

      expect(settingsRepository.findOne).toHaveBeenCalledWith({
        name: 'custom',
      });
    });

    it('should throw SettingsNotFound is not present', async () => {
      settingsRepository.findOne.mockResolvedValue(null);

      await expect(
        settingsService.getSetting<TestSettings>('custom'),
      ).rejects.toThrow(
        new SettingsNotFoundException('Settings has not been found: custom'),
      );
    });
  });

  describe('createOrUpdate', () => {
    it('should save the settings when no exception occurred', async () => {
      // Cast that way to make test easier to compare with the same input/output
      // Otherwise some type inference error could occurred due to the DeepPartial as argument
      let settingsSave: Settings = null;
      settingsRepository.save.mockImplementation((value: Settings) => {
        settingsSave = value;
        return Promise.resolve(value);
      });

      expect(
        await settingsService.createOrUpdate('custom', { a: 'b' }),
      ).toEqual(settingsSave.values);

      expect(settingsRepository.save).toHaveBeenCalledWith(settingsSave);
      expect(settingsSave.values).toEqual({ a: 'b' });
      expect(settingsSave.name).toEqual('custom');
    });

    it('should update the settings when duplicate exception', async () => {
      const updatedSettings = new Settings({
        name: 'custom',
        values: { a: 'b' },
      });

      settingsRepository.save.mockImplementation(() => {
        throw {
          message: 'duplicate',
          constraint: 'UQ_ca7857276d2a30f4dcfa0e42cd4',
        };
      });

      settingsRepository.findOne.mockResolvedValue(updatedSettings);

      expect(
        await settingsService.createOrUpdate('custom', updatedSettings.values),
      ).toEqual(updatedSettings.values);

      expect(settingsRepository.update).toHaveBeenCalledWith(
        {
          name: 'custom',
        },
        {
          values: { a: 'b' },
        },
      );

      expect(settingsRepository.findOne).toHaveBeenCalledWith({
        name: 'custom',
      });
    });

    it('should forward the exception when not handled', async () => {
      const error = new Error('other');

      settingsRepository.save.mockImplementation(() => {
        throw error;
      });

      await expect(
        settingsService.createOrUpdate('custom', {}),
      ).rejects.toThrow(error);
    });
  });
});
