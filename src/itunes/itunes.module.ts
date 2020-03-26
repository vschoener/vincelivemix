import { Module } from '@nestjs/common';
import { ItunesService } from './itunes.service';
import { ItunesController } from './itunes.controller';
import { SettingsModule } from '../shared/settings/settings.module';

@Module({
  controllers: [ItunesController],
  providers: [ItunesService],
  imports: [SettingsModule]
})
export class ItunesModule {}
