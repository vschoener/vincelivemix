import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

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

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  publishedAt?: Date;
}
