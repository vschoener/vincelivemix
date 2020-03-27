import { IsNumber } from 'class-validator';

export class EpisodeSettingsDto {
  @IsNumber()
  episodeId: number;
}
