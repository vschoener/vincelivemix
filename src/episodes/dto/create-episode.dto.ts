import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEpisodeDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  number: number;
}
