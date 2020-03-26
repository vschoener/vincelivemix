import {
  IsArray, IsEmail,
  IsIn,
  IsNotEmpty, IsOptional,
  IsString,
  IsUrl,
  MinLength, ValidateNested,
} from 'class-validator';

export class ItunesSettingsDto {
  @IsString()
  @MinLength(10)
  ownerName: string;

  @IsEmail()
  @MinLength(10)
  ownerEmail: string;

  @IsString()
  @MinLength(10)
  title: string;

  @IsString()
  @MinLength(10)
  subtitle: string;

  @IsString()
  @MinLength(20)
  summary: string;

  @IsString()
  @MinLength(2)
  language: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  copyright: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsArray()
  @IsString({
    each: true,
  })
  @MinLength(3, {
    each: true,
  })
  categories: string[];

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsIn(['true', 'false', 'yes', 'no', 'clean'])
  explicit: 'true' | 'false' | 'yes' | 'no' | 'clean' = 'false';

  @IsUrl()
  @IsOptional()
  newFeedUrl?: string;

  @IsString()
  @IsNotEmpty()
  keywords: string;
}
