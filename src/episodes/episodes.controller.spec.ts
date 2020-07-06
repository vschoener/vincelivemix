import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { Episode } from './episode.entity';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { EpisodeDuplicatedException } from './exceptions/episode-duplicated.exception';

describe('Episode Controller', () => {
  let controller: EpisodesController;
  let episodesServiceMock: jest.Mocked<EpisodesService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpisodesController],
      providers: [
        {
          provide: EpisodesService,
          useValue: {
            getPublishedEpisode: jest.fn(),
            getHighLightEpisode: jest.fn(),
            getEpisodeById: jest.fn(),
            createEpisode: jest.fn(),
            createOrUpdateEpisodeSettings: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EpisodesController>(EpisodesController);
    episodesServiceMock = module.get(EpisodesService) as jest.Mocked<
      EpisodesService
    >;
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('#getEpisodes should retrieve the published episodes', async () => {
    const episodes: Episode[] = [
      new Episode({
        id: 1,
        title: 'Live mix 1',
      }),
    ];

    episodesServiceMock.getPublishedEpisode.mockResolvedValue(episodes);

    expect(await controller.getEpisodes()).toEqual(episodes);

    expect(episodesServiceMock.getPublishedEpisode).toHaveBeenCalledWith();
  });

  it('#getHighlightEpisode should retrieve the highlight episode', async () => {
    const episode = new Episode({
      id: 1,
      title: 'Highlight',
    });

    episodesServiceMock.getHighLightEpisode.mockResolvedValue(episode);
    expect(await controller.getHighlightEpisode()).toEqual(episode);

    expect(episodesServiceMock.getHighLightEpisode).toHaveBeenCalledWith();
  });

  it('#getEpisodeById should retrieve the episode by its id', async () => {
    const episode = new Episode({
      id: 1,
      title: 'Highlight',
    });

    episodesServiceMock.getEpisodeById.mockResolvedValue(episode);
    expect(await controller.getEpisodeById(1)).toEqual(episode);

    expect(episodesServiceMock.getEpisodeById).toHaveBeenCalledWith(1);
  });

  it('#createEpisode should create an episode', async () => {
    const createEpisodeDto = new CreateEpisodeDto();
    createEpisodeDto.number = 1;
    createEpisodeDto.description =
      'New title running with last huge electro mix';

    const episode = new Episode({
      number: 1,
      description: 'New title running with last huge electro mix',
    });

    episodesServiceMock.createEpisode.mockResolvedValue(episode);

    expect(await controller.createEpisode(createEpisodeDto)).toEqual(episode);
    expect(episodesServiceMock.createEpisode).toHaveBeenCalledWith(
      createEpisodeDto,
    );
  });

  it('#createEpisode should throw BadRequestException if episode is duplicated', async () => {
    const createEpisodeDto = new CreateEpisodeDto();
    createEpisodeDto.number = 1;
    createEpisodeDto.description =
      'New title running with last huge electro mix';

    episodesServiceMock.createEpisode.mockImplementation(() => {
      throw new EpisodeDuplicatedException();
    });

    await expect(controller.createEpisode(createEpisodeDto)).rejects.toThrow(
      EpisodeDuplicatedException,
    );
  });

  it('#createEpisode should forward exception in any other case', async () => {
    const createEpisodeDto = new CreateEpisodeDto();
    createEpisodeDto.number = 1;
    createEpisodeDto.description =
      'New title running with last huge electro mix';

    const error = new Error('something else');

    episodesServiceMock.createEpisode.mockImplementation(() => {
      throw error;
    });

    await expect(controller.createEpisode(createEpisodeDto)).rejects.toThrow(
      error,
    );
  });
});
