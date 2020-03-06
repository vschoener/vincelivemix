import { Injectable } from '@nestjs/common';

@Injectable()
export class DateManagerService {
  getNewDate(): Date {
    return new Date();
  }
}
