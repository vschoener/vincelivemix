import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NAME_CONSTRAINT, Settings } from './entity/settings.entity';
import { SettingsNotFoundException } from './exception/settings-not-found.exception';

export class SettingsService {
  public constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}

  public async getSetting<T extends Record<string, unknown>>(
    name: string,
  ): Promise<T> {
    const settings = await this.settingsRepository.findOne({
      name,
    });

    if (!settings) {
      throw new SettingsNotFoundException(
        `Settings has not been found: ${name}`,
      );
    }

    // This one is a bit tricky as I can't use generic to indirectly type the one in Settings
    return settings.values as T;
  }

  public async createOrUpdate<T extends Record<string, unknown>>(
    name: string,
    values: T,
  ): Promise<T> {
    const settings = new Settings<T>({
      name,
      values,
    });

    try {
      return (await this.settingsRepository.save(settings)).values;
    } catch (ex) {
      // Trying to match construct with QueryFailedError brings code complexity
      // @see https://librenepal.com/article/catching-unique-constraint-errors-in-typeorm/ for a better explanation
      if (ex.constraint === NAME_CONSTRAINT) {
        await this.settingsRepository.update(
          {
            name,
          },
          {
            values,
          },
        );

        return (
          await this.settingsRepository.findOne({
            name,
          })
        ).values as T;
      }

      throw ex;
    }
  }
}
