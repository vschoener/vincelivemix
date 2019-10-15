import { Injectable } from '@nestjs/common';
import { Episode, EpisodeStatus } from './episode';
import * as uuid from 'uuid/v1';
import { CreateEpisodeDto } from './dto/create-episode.dto';

@Injectable()
export class EpisodesService {
  getAllEpisodes(): Episode[] {
    return [];
  }

  getEpisodeById(id: string): Episode {
    return {} as Episode;
  }

  createEpisode(createEpisodeDto: CreateEpisodeDto): Episode {
    const episode: Episode = {
      id: uuid(),
      status: EpisodeStatus.DRAFT,
      ...createEpisodeDto,
    };

    return episode;
  }
}
