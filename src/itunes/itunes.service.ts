import { Inject } from '@nestjs/common';
import { SettingsService } from '../shared/settings/settings.service';
import { ItunesSettingsDomainModel } from './domain-models/itunes-settings.domain-model';
import { ItunesSettingsDto } from './dto/itunes-settings.dto';

export class ItunesService {
  private settingName = 'itunes';

  constructor(
    @Inject(SettingsService) private readonly settings: SettingsService<ItunesSettingsDomainModel>
  ) {}

  public async getSettings() {
    const { values } = await this.settings.getSetting(this.settingName);

    return values;
  }

  public async createOrUpdate(settings: ItunesSettingsDto) {
    return this.settings.createOrUpdate(this.settingName, settings);
  }
}
