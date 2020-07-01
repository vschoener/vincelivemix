import { EpisodeSettingsDomainModel } from '../../episodes/domainmodel/episode-settings.domain-model';
import { ItunesSettingsDomainModel } from '../domain-models/itunes-settings.domain-model';

export type ResponsesSettingsDto =
  | ItunesSettingsDomainModel
  | EpisodeSettingsDomainModel;
