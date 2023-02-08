import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import request from 'supertest';

import { DateManagerService } from '../src/core/date/date-manager.service';
import { AppModule } from '../src/app.module';
import { Settings } from '../src/settings/entity/settings.entity';
import { Episode } from '../src/episodes/episode.entity';
import { SettingsService } from '../src/settings/settings.service';
import { EpisodeSettingsDomainModel } from '../src/episodes/domainmodel/episode-settings.domain-model';
import { EpisodesService } from '../src/episodes/episodes.service';
import { createPublishedEpisodeDto } from './fixtures/episode.fixture';
import { EpisodeStatus } from '../src/episodes/episode.enum';

describe('EpisodeController (e2e)', () => {
  let app: INestApplication;
  let dateManagerService: DateManagerService;
  let settingsRepository: Repository<Settings>;
  let episodeRepository: Repository<Episode>;
  let settingsService: SettingsService;
  let episodeService: EpisodesService;
  const date = new Date('2020-07-06T12:11:17.006Z');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dateManagerService = app.get(DateManagerService);
    settingsService = app.get(SettingsService);
    episodeService = app.get(EpisodesService);
    settingsRepository = app.get(getRepositoryToken(Settings));
    episodeRepository = app.get(getRepositoryToken(Episode));

    jest.spyOn(dateManagerService, 'getNewDate').mockReturnValue(date);
  });

  beforeEach(async () => {
    await Promise.all([settingsRepository.clear(), episodeRepository.clear()]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/episodes/highlight-episode', () => {
    it('should respond a 404 if the settings does not exist', () => {
      return request(app.getHttpServer())
        .get('/api/episodes/highlight-episode')
        .expect(404);
    });

    it('should respond a 404 if settings exist but highlightEpisode is not set', async () => {
      await settingsService.createOrUpdate('episode', {});

      return request(app.getHttpServer())
        .get('/api/episodes/highlight-episode')
        .expect(404);
    });

    it('should respond a 404 if settings is properly set but episode is missing', async () => {
      await settingsService.createOrUpdate<EpisodeSettingsDomainModel>(
        'episode',
        {
          highlightEpisode: 1,
        },
      );

      return request(app.getHttpServer())
        .get('/api/episodes/highlight-episode')
        .expect(404);
    });

    it('should respond a 200 if settings and episode exist', async () => {
      const episode = await episodeService.createEpisode({
        ...createPublishedEpisodeDto,
        publishedAt: date,
      });

      await settingsService.createOrUpdate<EpisodeSettingsDomainModel>(
        'episode',
        {
          highlightEpisode: episode.id,
        },
      );

      return request(app.getHttpServer())
        .get('/api/episodes/highlight-episode')
        .expect(200)
        .expect({
          audioLink: 'http://www.audio-link.test',
          coverImage: 'http://www.cover-link.test',
          createdAt: '2020-07-06T12:11:17.006Z',
          description: 'description',
          durationAudioInSecond: 3600,
          id: episode.id,
          itunesDuration: '01:00:00',
          itunesExplicit: false,
          itunesImageLink: 'http://www.itunes-images-link.test',
          itunesKeywords: 'electro',
          itunesSummary:
            'itunes summary must be long enough so here is some text',
          number: 1,
          publishedAt: '2020-07-06T12:11:17.006Z',
          status: 'published',
          title: 'Live mix 1',
          updatedAt: '2020-07-06T12:11:17.006Z',
        });
    });
  });

  describe('GET /api/episodes', () => {
    it('should respond the episodes list if they are published ordered by this date', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [episode1, episode2, episode3] = await Promise.all([
        episodeService.createEpisode({
          ...createPublishedEpisodeDto,
          publishedAt: date,
        }),
        episodeService.createEpisode({
          ...createPublishedEpisodeDto,
          publishedAt: undefined,
          status: EpisodeStatus.DRAFT,
          number: 2,
          title: 'Live mix 2',
        }),
        episodeService.createEpisode({
          ...createPublishedEpisodeDto,
          publishedAt: new Date('2020-08-06T12:11:17.006Z'),
          number: 3,
          title: 'Live mix 3',
        }),
      ]);

      return request(app.getHttpServer())
        .get('/api/episodes')
        .expect(200)
        .expect([
          {
            audioLink: 'http://www.audio-link.test',
            coverImage: 'http://www.cover-link.test',
            createdAt: '2020-07-06T12:11:17.006Z',
            description: 'description',
            durationAudioInSecond: 3600,
            id: episode3.id,
            itunesDuration: '01:00:00',
            itunesExplicit: false,
            itunesImageLink: 'http://www.itunes-images-link.test',
            itunesKeywords: 'electro',
            itunesSummary:
              'itunes summary must be long enough so here is some text',
            number: 3,
            publishedAt: '2020-08-06T12:11:17.006Z',
            status: 'published',
            title: 'Live mix 3',
            updatedAt: '2020-07-06T12:11:17.006Z',
          },
          {
            audioLink: 'http://www.audio-link.test',
            coverImage: 'http://www.cover-link.test',
            createdAt: '2020-07-06T12:11:17.006Z',
            description: 'description',
            durationAudioInSecond: 3600,
            id: episode1.id,
            itunesDuration: '01:00:00',
            itunesExplicit: false,
            itunesImageLink: 'http://www.itunes-images-link.test',
            itunesKeywords: 'electro',
            itunesSummary:
              'itunes summary must be long enough so here is some text',
            number: 1,
            publishedAt: '2020-07-06T12:11:17.006Z',
            status: 'published',
            title: 'Live mix 1',
            updatedAt: '2020-07-06T12:11:17.006Z',
          },
        ]);
    });
  });

  describe('GET /api/episodes/:id', () => {
    it('should respond 404 if episode is not found', () => {
      return request(app.getHttpServer()).get('/api/episodes/1337').expect(404);
    });

    it('should respond 200 if episode exists', async () => {
      const episode = await episodeService.createEpisode({
        ...createPublishedEpisodeDto,
        publishedAt: date,
      });

      return request(app.getHttpServer())
        .get(`/api/episodes/${episode.id}`)
        .expect(200)
        .expect({
          audioLink: 'http://www.audio-link.test',
          coverImage: 'http://www.cover-link.test',
          createdAt: '2020-07-06T12:11:17.006Z',
          description: 'description',
          durationAudioInSecond: 3600,
          id: episode.id,
          itunesDuration: '01:00:00',
          itunesExplicit: false,
          itunesImageLink: 'http://www.itunes-images-link.test',
          itunesKeywords: 'electro',
          itunesSummary:
            'itunes summary must be long enough so here is some text',
          number: 1,
          publishedAt: '2020-07-06T12:11:17.006Z',
          status: 'published',
          title: 'Live mix 1',
          updatedAt: '2020-07-06T12:11:17.006Z',
        });
    });
  });

  describe('POST /api/episodes', () => {
    it('should respond 400 with all requirement to create an episode', () => {
      return request(app.getHttpServer())
        .post('/api/episodes')
        .send({})
        .expect(400)
        .expect({
          statusCode: 400,
          message:[
            'title should not be empty',
            'title must be a string',
            'description should not be empty',
            'description must be a string',
            'number must be a number conforming to the specified constraints',
            'status must be one of the following values: published, draft',
            'coverImage must be a URL address',
            'audioLink must be a URL address',
            'durationAudioInSecond must not be less than 1',
            'durationAudioInSecond must be a number conforming to the specified constraints',
            'itunesDuration must match /^(?:(?:([01]?\\d|2[0-3]):)?([0-5]?\\d):)?([0-5]?\\d)$/ regular expression',
            'itunesSummary must be longer than or equal to 20 characters',
            'itunesSummary must be a string',
            'itunesImageLink must be a URL address'
          ],
          error: 'Bad Request',
        });
    });

    it('should response 200 with the created episode', () => {
      return request(app.getHttpServer())
        .post('/api/episodes')
        .send(createPublishedEpisodeDto)
        .expect(201)
        .expect((res) => ({
          audioLink: 'http://www.audio-link.test',
          coverImage: 'http://www.cover-link.test',
          createdAt: '2020-07-06T12:11:17.006Z',
          description: 'description',
          durationAudioInSecond: 3600,
          id: res.body.id,
          itunesDuration: '01:00:00',
          itunesExplicit: false,
          itunesImageLink: 'http://www.itunes-images-link.test',
          itunesKeywords: 'electro',
          itunesSummary:
            'itunes summary must be long enough so here is some text',
          number: 1,
          publishedAt: '2020-07-06T12:03:18.964Z',
          status: 'published',
          title: 'Live mix 1',
          updatedAt: '2020-07-06T12:11:17.006Z',
        }));
    });

    it('should response with 409 if we try to recreate the same episode', async () => {
      await request(app.getHttpServer())
        .post('/api/episodes')
        .send(createPublishedEpisodeDto);

      return request(app.getHttpServer())
        .post('/api/episodes')
        .send(createPublishedEpisodeDto)
        .expect(409);
    });
  });
});
