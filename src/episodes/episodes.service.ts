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
import { SettingsService } from '../shared/settings/settings.service';
import { EpisodeSettingsDomainModel } from './domainmodel/episode-settings.domain-model';
import { EpisodeSettingsDto } from './dto/episode-settings.dto';
import { Settings } from '../shared/settings/entity/settings.entity';

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
    private readonly settings: SettingsService<EpisodeSettingsDomainModel>,
    @Inject('winston') logger: Logger,
  ) {
    this.logger = logger.child({ context: EpisodesService.name });
  }

  public async getEpisodeById(id: number): Promise<Episode> {
    const episode = await this.episodeRepository.findOne(id);

    if (!episode) {
      throw new NotFoundException(`Episode not found ${id}`);
    }

    return episode;
  }

  public async getHighLightEpisode(): Promise<Episode | null> {
    this.logger.info('Getting highlight episode...');
    const { highlightEpisode } = await this.settings.getSetting(
      this.settingsName,
    );

    if (!highlightEpisode) {
      this.logger.error('Highlight episode not set');
      throw new NotFoundException('Highlight episode not set');
    }

    this.logger.info('Retrieving episode', { highlightEpisode });
    return this.episodeRepository.findOne(highlightEpisode);
  }

  public async createOrUpdateEpisodeSettings(
    episodeSettingsDto: EpisodeSettingsDto,
  ): Promise<Settings<EpisodeSettingsDomainModel>> {
    return this.settings.createOrUpdate(this.settingsName, {
      highlightEpisode: episodeSettingsDto.episodeId,
    });
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
      await this.episodeRepository.save(episode);
    } catch (err) {
      if (err.constructor === QueryFailedError) {
        // TODO: Looks like the type are not up to date from this time
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

    return episode;
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
