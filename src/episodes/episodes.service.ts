import * as fs from 'fs';
import { extname } from 'path';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from './episode.entity';
import { Repository } from 'typeorm';
import { EpisodeStatus } from './episode.enum';
import { DateManagerService } from '../core/date/date-manager.service';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @Inject(DateManagerService) private dateManagerService: DateManagerService,
  ) {}

  getEpisodeById(id: number): Promise<Episode> {
    const episode = this.episodeRepository.findOne(id);

    if (!episode) {
      throw new NotFoundException(`Episode not found ${id}`);
    }

    return episode;
  }

  async createEpisode(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    const episode = new Episode();
    episode.description = createEpisodeDto.description;
    episode.title = createEpisodeDto.title;
    episode.number = createEpisodeDto.number;
    episode.status = EpisodeStatus.DRAFT;
    episode.createdAt = this.dateManagerService.getNewDate();
    episode.updatedAt = this.dateManagerService.getNewDate();

    await episode.save();

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
}
