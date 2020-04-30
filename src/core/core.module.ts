import { Global, Module } from '@nestjs/common';

import { DateManagerService } from './date/date-manager.service';

@Global()
@Module({
  providers: [DateManagerService],
  exports: [DateManagerService],
})
export class CoreModule {}
