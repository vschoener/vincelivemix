import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsIn,
  IsUrl,
  MinLength,
  IsArray,
  IsBoolean,
  Min,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { EpisodeStatus } from '../episode.enum';

export class CreateEpisodeDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsNumber()
  @Transform((value) => Number(value))
  public number: number;

  @IsIn(['published', 'draft'])
  public status: EpisodeStatus;

  @IsUrl()
  public coverImage: string;

  @IsUrl()
  public audioLink: string;

  @IsNumber()
  @Min(1)
  public durationAudioInSecond: number;

  @Matches(/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/)
  public itunesDuration: string;

  @IsString()
  @MinLength(20)
  public itunesSummary: string;

  @IsUrl()
  public itunesImageLink: string;

  @IsArray()
  @IsString({
    each: true,
  })
  public itunesKeywords: string[];

  @IsBoolean()
  public itunesExplicit = false;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  public publishedAt?: Date;
}
