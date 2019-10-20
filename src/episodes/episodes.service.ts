import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { EpisodeRepository } from './episode.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from './episode.entity';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(EpisodeRepository) private readonly episodeRepository: EpisodeRepository,
  ) {}

  // getAllEpisodes(): Episode[] {
  //   return this.episodeRepository.find();
  // }

  getEpisodeById(id: number): Promise<Episode> {
    const episode = this.episodeRepository.findOne(id);

    if (!episode) {
      throw new NotFoundException(`Episode not found ${id}`);
    }

    return episode;
  }

  createEpisode(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    return this.episodeRepository.createEpisode(createEpisodeDto);
  }
}
