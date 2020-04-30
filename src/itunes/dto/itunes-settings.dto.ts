import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class ItunesSettingsDto {
  @IsString()
  @MinLength(10)
  public ownerName: string;

  @IsEmail()
  @MinLength(10)
  public ownerEmail: string;

  @IsString()
  @MinLength(10)
  public title: string;

  @IsString()
  @MinLength(10)
  public subtitle: string;

  @IsString()
  @MinLength(20)
  public summary: string;

  @IsString()
  @MinLength(2)
  public language: string;

  @IsString()
  @IsNotEmpty()
  public link: string;

  @IsString()
  @IsNotEmpty()
  public copyright: string;

  @IsString()
  @IsNotEmpty()
  public author: string;

  @IsArray()
  @IsString({
    each: true,
  })
  @MinLength(3, {
    each: true,
  })
  public categories: string[];

  @IsUrl()
  @IsNotEmpty()
  public image: string;

  @IsIn(['true', 'false', 'yes', 'no', 'clean'])
  public explicit: 'true' | 'false' | 'yes' | 'no' | 'clean' = 'false';

  @IsUrl()
  @IsOptional()
  public newFeedUrl?: string;

  @IsString()
  @IsNotEmpty()
  public keywords: string;
}
