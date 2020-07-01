import { Test, TestingModule } from '@nestjs/testing';
import { QueryFailedError, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { NotFoundException } from '@nestjs/common';

import { EpisodesService } from './episodes.service';
import { Episode } from './episode.entity';
import { DateManagerService } from '../core/date/date-manager.service';
import { loggerSettings } from '../core/logger/logger.settings';
import { EpisodeMapper } from './mapper/episode.mapper';
import { EpisodeStatus } from './episode.enum';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { EPISODE_CONSTRAINT } from './constants';
import { EpisodeDuplicated } from './exceptions/EpisodeDuplicated';
import { SettingsService } from '../settings/settings.service';

describe('EpisodeService', () => {
  const date = new Date();
  let episodeService: EpisodesService;
  let episodeRepository: jest.Mocked<Repository<Episode>>;
  let settingsService: jest.Mocked<SettingsService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WinstonModule.forRoot(loggerSettings)],
      providers: [
        EpisodesService,
        DateManagerService,
        EpisodeMapper,
        {
          provide: getRepositoryToken(Episode),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: SettingsService,
          useValue: {
            getSetting: jest.fn(),
            createOrUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    episodeService = module.get<EpisodesService>(EpisodesService);
    episodeRepository = module.get(getRepositoryToken(Episode));
    settingsService = module.get(SettingsService);

    jest
      .spyOn(DateManagerService.prototype, 'getNewDate')
      .mockReturnValue(date);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(episodeService).toBeDefined();
  });

  describe('#getEpisodeById', () => {
    it('should return the episode', async () => {
      const episode = new Episode({
        id: 1,
        audioLink: 'http://my.mp3.location',
      });

      episodeRepository.findOne.mockResolvedValue(episode);

      expect(await episodeService.getEpisodeById(1)).toEqual(episode);
    });

    it('should throw NotFoundException if not found', async () => {
      episodeRepository.findOne.mockResolvedValue(undefined);

      await expect(episodeService.getEpisodeById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('#getHighLightEpisode', () => {
    it('should return the highlight episode', async () => {
      const episodeResult = {
        highlightEpisode: 1,
      };
      const episode = new Episode({
        id: 1,
      });

      settingsService.getSetting.mockResolvedValue(episodeResult);
      episodeRepository.findOne.mockResolvedValue(episode);

      expect(await episodeService.getHighLightEpisode()).toEqual(episode);

      expect(settingsService.getSetting).toHaveBeenCalledWith('episode');
      expect(episodeRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if settings are not found', async () => {
      settingsService.getSetting.mockResolvedValue(null);

      await expect(episodeService.getHighLightEpisode()).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if highlightEpisode settings is not set', async () => {
      settingsService.getSetting.mockResolvedValue({
        highlightEpisode: null,
      });

      await expect(episodeService.getHighLightEpisode()).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('#createEpisode', () => {
    it('should create episode', async () => {
      const createEpisodeDto = new CreateEpisodeDto();
      createEpisodeDto.title = 'Live mix 1';
      createEpisodeDto.itunesKeywords = ['electro', 'house'];

      const episode = new Episode({
        id: 1,
        title: 'Live mix 1',
        status: EpisodeStatus.DRAFT,
        itunesKeywords: 'electro, house',
        createdAt: date,
        updatedAt: date,
      });

      episodeRepository.save.mockResolvedValue(episode);

      expect(await episodeService.createEpisode(createEpisodeDto)).toEqual(
        episode,
      );
    });

    it('should create episode using provided status', async () => {
      const createEpisodeDto = new CreateEpisodeDto();
      createEpisodeDto.status = EpisodeStatus.DISABLE;

      const episode = new Episode({
        status: EpisodeStatus.DISABLE,
        itunesKeywords: '',
        createdAt: date,
        updatedAt: date,
      });

      episodeRepository.save.mockResolvedValue(episode);

      expect(await episodeService.createEpisode(createEpisodeDto)).toEqual(
        episode,
      );
    });

    it('should create episode when status is published using create date when publishedAt is missing', async () => {
      const createEpisodeDto = new CreateEpisodeDto();
      createEpisodeDto.status = EpisodeStatus.PUBLISHED;

      const episode = new Episode({
        status: EpisodeStatus.DISABLE,
        itunesKeywords: '',
        createdAt: date,
        updatedAt: date,
        publishedAt: date,
      });

      episodeRepository.save.mockResolvedValue(episode);

      expect(await episodeService.createEpisode(createEpisodeDto)).toEqual(
        episode,
      );
    });

    it('should create episode when status is published using publishedAt when provider', async () => {
      const createEpisodeDto = new CreateEpisodeDto();
      createEpisodeDto.status = EpisodeStatus.PUBLISHED;
      createEpisodeDto.publishedAt = new Date('2020-06-25T08:54:46.921Z');

      const episode = new Episode({
        status: EpisodeStatus.DISABLE,
        itunesKeywords: '',
        createdAt: date,
        updatedAt: date,
        publishedAt: createEpisodeDto.publishedAt,
      });

      episodeRepository.save.mockResolvedValue(episode);

      expect(await episodeService.createEpisode(createEpisodeDto)).toEqual(
        episode,
      );
    });

    it('should create episode but not set/use publishedAt status is not published', async () => {
      const createEpisodeDto = new CreateEpisodeDto();
      createEpisodeDto.status = EpisodeStatus.PUBLISHED;
      createEpisodeDto.publishedAt = new Date('2020-06-25T08:54:46.921Z');

      const episode = new Episode({
        status: EpisodeStatus.DISABLE,
        itunesKeywords: '',
        createdAt: date,
        updatedAt: date,
      });

      episodeRepository.save.mockResolvedValue(episode);

      expect(await episodeService.createEpisode(createEpisodeDto)).toEqual(
        episode,
      );
    });

    it('should throw EpisodeDuplicated when EPISODE_CONSTRAINT constraint is raise by the db', async () => {
      const createEpisodeDto = new CreateEpisodeDto();

      // This is for now a hacky part as QueryFailedError is wrongly typed because constraint is not defined but present
      const error = new QueryFailedError('Failed', [], []);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      error.constraint = EPISODE_CONSTRAINT;

      episodeRepository.save.mockImplementation(() => {
        throw error;
      });

      await expect(
        episodeService.createEpisode(createEpisodeDto),
      ).rejects.toThrow(EpisodeDuplicated);
    });

    it('should let throw any other error', async () => {
      const createEpisodeDto = new CreateEpisodeDto();

      const error = new Error('Something else');

      episodeRepository.save.mockImplementation(() => {
        throw error;
      });

      await expect(
        episodeService.createEpisode(createEpisodeDto),
      ).rejects.toThrow(error);
    });
  });

  describe('#getPublishedEpisode', () => {
    it('should get the published episode', async () => {
      const episodes: Episode[] = [
        new Episode({
          id: 1,
        }),
      ];

      episodeRepository.find.mockResolvedValue(episodes);

      expect(await episodeService.getPublishedEpisode()).toEqual(episodes);
    });
  });
});
