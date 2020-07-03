import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Episode } from './episode.entity';
import { EpisodeMapper } from './mapper/episode.mapper';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Episode]), SettingsModule],
  controllers: [EpisodesController],
  providers: [EpisodesService, EpisodeMapper],
  exports: [EpisodesService],
})
export class EpisodesModule {}
