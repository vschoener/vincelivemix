import { Episode } from '../episode.entity';
import { CreateEpisodeDto } from '../dto/create-episode.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EpisodeMapper {
  mapCreateEpisodeDtoToDomain(createEpisodeDto: CreateEpisodeDto): Episode {
    const { itunesKeywords, ...rest } = createEpisodeDto;

    const episode = new Episode(rest);
    episode.itunesKeywords = itunesKeywords.join(',');

    return episode;
  }
}
