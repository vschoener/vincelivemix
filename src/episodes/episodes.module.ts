import { Module } from '@nestjs/common';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeRepository } from './episode.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EpisodeRepository,
    ]),
  ],
  controllers: [EpisodesController],
  providers: [EpisodesService],
})
export class EpisodesModule {}
