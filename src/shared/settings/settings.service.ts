import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Settings } from './entity/settings.entity';
import { UNIQUE_VIOLATION_CODE_ERROR } from '../constants/postgres.constant';
import { TypeSettings } from './types/settings.type';

export class SettingsService<T extends TypeSettings> {
  public constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings<T>>,
  ) {}

  public async getSetting(name: string): Promise<T> {
    const { values } = await this.settingsRepository.findOne({
      name,
    });

    return values;
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      { values },
    );

    return this.settingsRepository.findOne({ name });
  }
}
