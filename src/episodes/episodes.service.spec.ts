import { Test, TestingModule } from '@nestjs/testing';
import { EpisodesService } from './episodes.service';
import { Repository } from 'typeorm';
import { Episode } from './episode.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DateManagerService } from '../core/date/date-manager.service';
import { WinstonModule } from 'nest-winston';
import { loggerSettings } from '../core/logger/logger.settings';
import { NotFoundException } from '@nestjs/common';
import { EpisodeMapper } from './mapper/episode.mapper';

describe('EpisodeService', () => {
  let episodeService: EpisodesService;
  let episodeRepository: jest.Mocked<Repository<Episode>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot(loggerSettings),
      ],
      providers: [
        EpisodesService,
        DateManagerService,
        EpisodeMapper,
        {
          provide: getRepositoryToken(Episode),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn()
          }
        }
      ],
    }).compile();

    episodeService = module.get<EpisodesService>(EpisodesService);
    episodeRepository = module.get(getRepositoryToken(Episode));
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
        audioLink: 'http://my.mp3.location'
      });

      episodeRepository.findOne.mockResolvedValue(episode);

      expect(await episodeService.getEpisodeById(1)).toEqual(episode);
    });

    it('should throw NotFoundException if not found', async () => {
      episodeRepository.findOne.mockResolvedValue(undefined);

      await expect(episodeService.getEpisodeById(1))
        .rejects.toThrow(NotFoundException);
    });
  })
});
