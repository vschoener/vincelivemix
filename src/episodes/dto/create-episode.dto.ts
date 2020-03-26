import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsIn,
  IsUrl,
  MinLength,
  IsMilitaryTime,
  IsArray,
  IsBoolean,
  Min, Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EpisodeStatus } from '../episode.enum';

export class CreateEpisodeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Transform(value => Number(value))
  number: number;

  @IsIn(['published', 'draft'])
  status: EpisodeStatus;

  @IsUrl()
  coverImage: string;

  @IsUrl()
  audioLink: string;

  @IsNumber()
  @Min(1)
  durationAudioInSecond: number;

  @Matches(/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/)
  itunesDuration: string;

  @IsString()
  @MinLength(20)
  itunesSummary: string;

  @IsUrl()
  itunesImageLink: string;

  @IsArray()
  @IsString({
    each: true,
  })
  itunesKeywords: string[];

  @IsBoolean()
  itunesExplicit: boolean = false;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  publishedAt?: Date;
}
