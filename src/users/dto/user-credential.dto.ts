import { IsString } from 'class-validator';

export class UserCredentialDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
