import { IsNumber } from 'class-validator';

export class EpisodeSettingsDto {
  @IsNumber()
  public episodeId: number;
}
