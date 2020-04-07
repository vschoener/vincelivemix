import { Global, Module } from '@nestjs/common';
import { DateManagerService } from './date/date-manager.service';
import { ConfigModule } from './config/config.module';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DateManagerService],
  exports: [DateManagerService],
})
export class CoreModule {}
