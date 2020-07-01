import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, QueryFailedError, Repository } from 'typeorm';
import { Logger } from 'winston';

import { CreateEpisodeDto } from './dto/create-episode.dto';
import { Episode } from './episode.entity';
import { EpisodeStatus } from './episode.enum';
import { DateManagerService } from '../core/date/date-manager.service';
import { EpisodeDuplicated } from './exceptions/EpisodeDuplicated';
import { EPISODE_CONSTRAINT } from './constants';
import { EpisodeMapper } from './mapper/episode.mapper';
import { EpisodeSettingsDomainModel } from './domainmodel/episode-settings.domain-model';
import { EpisodeSettingsDto } from './dto/episode-settings.dto';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class EpisodesService {
  private readonly logger: Logger;

  private readonly settingsName = 'episode';

  public constructor(
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @Inject(DateManagerService) private dateManagerService: DateManagerService,
    @Inject(EpisodeMapper) private episodeMapper: EpisodeMapper,
    @Inject(SettingsService)
    private readonly settings: SettingsService,
    @Inject('winston') logger: Logger,
  ) {
    this.logger = logger.child({ context: EpisodesService.name });
  }

  public async getEpisodeById(id: number): Promise<Episode> {
    this.logger.info('Getting episode...', { id });
    const episode = await this.episodeRepository.findOne(id);

    if (!episode) {
      throw new NotFoundException(`Episode not found ${id}`);
    }

    return episode;
  }

  public async getHighLightEpisode(): Promise<Episode | null> {
    this.logger.info('Getting highlight episode...');
    const episodeSettings = await this.settings.getSetting<
      EpisodeSettingsDomainModel
    >(this.settingsName);

    if (!episodeSettings || !episodeSettings.highlightEpisode) {
      this.logger.error('Highlight episode not set');
      throw new NotFoundException('Highlight episode not set');
    }

    const { highlightEpisode } = episodeSettings;

    this.logger.info('Retrieving episode', { highlightEpisode });
    return this.episodeRepository.findOne(highlightEpisode);
  }

  public async createEpisode(
    createEpisodeDto: CreateEpisodeDto,
  ): Promise<Episode> {
    this.logger.info('Creating episode...', createEpisodeDto);

    const episode = this.episodeMapper.mapCreateEpisodeDtoToDomain(
      createEpisodeDto,
    );

    episode.status = createEpisodeDto.status ?? EpisodeStatus.DRAFT;
    episode.createdAt = this.dateManagerService.getNewDate();
    episode.updatedAt = this.dateManagerService.getNewDate();

    if (createEpisodeDto.status === EpisodeStatus.PUBLISHED) {
      episode.publishedAt = episode.publishedAt ?? episode.createdAt;
    }

    try {
      return this.episodeRepository.save(episode);
    } catch (err) {
      if (err.constructor === QueryFailedError) {
        // TODO: Looks like the type are not up to date from this QueryFailedError
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (err.constraint === EPISODE_CONSTRAINT) {
          this.logger.error('Episode already exists', {
            number: episode.number,
          });
          throw new EpisodeDuplicated('Episode number already exists');
        }
      }

      this.logger.error('Error creating episode', {
        episode,
      });

      throw err;
    }
  }

  public getPublishedEpisode(): Promise<Episode[]> {
    return this.getEpisodes({
      order: {
        publishedAt: 'DESC',
      },
      where: {
        status: EpisodeStatus.PUBLISHED,
      },
    });
  }

  private getEpisodes(
    findManyOptions?: FindManyOptions<Episode>,
  ): Promise<Episode[]> {
    return this.episodeRepository.find(findManyOptions);
  }
}
