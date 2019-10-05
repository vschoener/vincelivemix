import { Injectable } from '@nestjs/common';

@Injectable()
export class RssService {
  public generate(): string {
    return 'my generated live mix rss';
  }
}
