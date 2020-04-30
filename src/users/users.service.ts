import { Injectable } from '@nestjs/common';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async findUserByEmail(_email: string): Promise<User> {
    return null;
  }
}
