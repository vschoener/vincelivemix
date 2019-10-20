import { EntityRepository, Repository } from 'typeorm';
import { Episode } from './episode.entity';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { EpisodeStatus } from './episode';

@EntityRepository(Episode)
export class EpisodeRepository extends Repository<Episode> {
  async createEpisode(createEpisodeDto: CreateEpisodeDto) {
    const episode = new Episode();
    episode.description = createEpisodeDto.description;
    episode.title = createEpisodeDto.title;
    episode.number = createEpisodeDto.number;
    episode.status = EpisodeStatus.DRAFT;

    await episode.save();

    return episode;
  }
}
