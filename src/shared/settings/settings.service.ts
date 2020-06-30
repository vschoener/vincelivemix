import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Settings } from './entity/settings.entity';
import { UNIQUE_VIOLATION_CODE_ERROR } from '../constants/postgres.constant';
import { SettingsNotFoundException } from './exception/settings-not-found.exception';

export class SettingsService<T = Record<string, unknown>> {
  public constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings<T>>,
  ) {}

  public async getSetting(name: string): Promise<T> {
    const settings = await this.settingsRepository.findOne({
      name,
    });

    if (!settings) {
      throw new SettingsNotFoundException(
        `Settings has not been found: ${name}`,
      );
    }

    return settings.values;
  }

  public async createOrUpdate(name: string, values: T): Promise<Settings<T>> {
    const settings = new Settings<T>({
      name,
      values,
    });

    try {
      return await settings.save();
    } catch (err) {
      if (
        !(
          err.constructor === QueryFailedError &&
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          err.code === UNIQUE_VIOLATION_CODE_ERROR
        )
      ) {
        throw err;
      }
    }

    await this.settingsRepository.update(
      {
        name,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      { values },
    );

    return await this.settingsRepository.findOne({ name });
  }
}
