import { Injectable } from '@nestjs/common';

import { Episode } from '../episode.entity';
import { CreateEpisodeDto } from '../dto/create-episode.dto';

@Injectable()
export class EpisodeMapper {
  public mapCreateEpisodeDtoToDomain(
    createEpisodeDto: CreateEpisodeDto,
  ): Episode {
    const { itunesKeywords, ...rest } = createEpisodeDto;

    const episode = new Episode(rest);
    episode.itunesKeywords = itunesKeywords.join(',');

    return episode;
  }
}
