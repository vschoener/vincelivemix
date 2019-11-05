import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

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
}
