import * as fs from 'fs';
import { extname } from 'path';
import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from './episode.entity';
import { Repository, QueryFailedError, FindManyOptions } from 'typeorm';
import { EpisodeStatus } from './episode.enum';
import { DateManagerService } from '../core/date/date-manager.service';
import { EpisodeDuplicated } from './exceptions/EpisodeDuplicated';
import { EPISODE_CONSTRAINT } from './constants';
import { Logger } from 'winston';
import { EpisodeMapper } from './mapper/episode.mapper';

@Injectable()
export class EpisodesService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(Episode) private readonly episodeRepository: Repository<Episode>,
    @Inject(DateManagerService) private dateManagerService: DateManagerService,
    @Inject(EpisodeMapper) private episodeMapper: EpisodeMapper,
    @Inject('winston') logger: Logger
  ) {
    this.logger = logger.child({ context: EpisodesService.name } )
  }

  async getEpisodeById(id: number): Promise<Episode> {
    const episode = await this.episodeRepository.findOne(id);

    if (!episode) {
      throw new NotFoundException(`Episode not found ${id}`);
    }

    return episode;
  }

  async createEpisode(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    this.logger.info('Creating episode...', createEpisodeDto);

    const episode = this.episodeMapper.mapCreateEpisodeDtoToDomain(createEpisodeDto);

    episode.status = createEpisodeDto.status ?? EpisodeStatus.DRAFT;
    episode.createdAt = this.dateManagerService.getNewDate();
    episode.updatedAt = this.dateManagerService.getNewDate();
    episode.publishedAt = createEpisodeDto.publishedAt ?? episode.createdAt;

    try {
      await this.episodeRepository.save(episode);
    } catch (err) {
      if (err.constructor === QueryFailedError) {
        if (err.constraint === EPISODE_CONSTRAINT) {
          this.logger.error('Episode already exists', {
            number: episode.number
          });
          throw new EpisodeDuplicated('Episode number already exists');
        }
      }

      this.logger.error('Error creating episode', {
        episode
      });

      throw err;
    }

    return episode;
  }

  /**
   * Handle the storage logic of the cover image
   * TODO: The pure image logic should be move in its own service if we want
   * to be cleaner
   *
   * @param episodeId
   * @param file
   * @param fileType
   */
  async storeImage(
    episodeId: number,
    file: Express.Multer.File,
    fileType: string = 'coverImage',
  ): Promise<Partial<Episode>> {
    const episode = await this.getEpisodeById(episodeId);

    const episodeDirectory = `${file.destination}/${episodeId}`;
    if (!fs.existsSync(episodeDirectory)) {
      fs.mkdirSync(episodeDirectory);
    }

    const destination = `${episodeDirectory}/coverImage${extname(file.path)}`;
    fs.renameSync(file.path, destination);

    episode[fileType] = destination;

    await episode.save();

    return { coverImage: episode.coverImage };
  }

  public getEpisodes(findManyOptions?: FindManyOptions): Promise<Episode[]> {
    return this.episodeRepository.find(findManyOptions);
  }
}
