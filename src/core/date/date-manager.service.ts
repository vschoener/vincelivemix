import { Injectable } from '@nestjs/common';

@Injectable()
export class DateManagerService {
  getNewDate() {
    return new Date();
  }
}
