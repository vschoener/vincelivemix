import * as fs from 'fs';
import { extname } from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { EpisodeRepository } from './episode.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from './episode.entity';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(EpisodeRepository)
    private readonly episodeRepository: EpisodeRepository,
  ) {}

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
