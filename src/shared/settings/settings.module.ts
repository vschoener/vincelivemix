import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from './entity/settings.entity';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Settings])],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
