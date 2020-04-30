import { IsString } from 'class-validator';

export class UserCredentialDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;
}
