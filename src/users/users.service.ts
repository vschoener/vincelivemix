import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  async findUserByEmail(email: string): Promise<User> {
    return null;
  }
}
