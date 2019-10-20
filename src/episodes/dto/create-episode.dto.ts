import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEpisodeDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Transform(value => Number(value))
  number: number;
}
