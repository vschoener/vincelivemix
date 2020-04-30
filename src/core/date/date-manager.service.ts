import { Injectable } from '@nestjs/common';

@Injectable()
export class DateManagerService {
  public getNewDate(): Date {
    return new Date();
  }
}
