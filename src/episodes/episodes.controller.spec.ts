import { Test, TestingModule } from '@nestjs/testing';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';

describe('Episode Controller', () => {
  let controller: EpisodesController;
  let episodesServiceMock: jest.Mocked<EpisodesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpisodesController],
      providers: [
        {
          provide: EpisodesService,
          useValue: {
            getEpisodeById: jest.fn(),
          }
        }
      ]
    }).compile();

    controller = module.get<EpisodesController>(EpisodesController);
    episodesServiceMock = module.get(EpisodesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
