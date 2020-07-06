import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../src/app.module';
import { DateManagerService } from '../src/core/date/date-manager.service';
import { EpisodesService } from '../src/episodes/episodes.service';
import { EpisodeStatus } from '../src/episodes/episode.enum';
import { Settings } from '../src/settings/entity/settings.entity';
import { SettingsService } from '../src/settings/settings.service';
import { Episode } from '../src/episodes/episode.entity';

describe('RssController (e2e)', () => {
  let app: INestApplication;
  let settingsService: SettingsService;
  let dateManagerService: DateManagerService;
  let settingsRepository: Repository<Settings>;
  let episodeRepository: Repository<Episode>;
  const date = new Date();
  let episodeService: EpisodesService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dateManagerService = app.get(DateManagerService);
    settingsRepository = app.get(getRepositoryToken(Settings));
    episodeRepository = app.get(getRepositoryToken(Episode));
    episodeService = app.get(EpisodesService);
    settingsService = app.get(SettingsService);

    jest.spyOn(dateManagerService, 'getNewDate').mockReturnValue(date);
  });

  beforeEach(async () => {
    await Promise.all([settingsRepository.clear(), episodeRepository.clear()]);
  });

  afterAll(async () => {
    await app.close();
  });

  async function createItunesSettings() {
    await settingsService.createOrUpdate('itunes', {
      title: 'Vince Live Mix',
      subtitle: 'Feel the vibe of the sound',
      summary: 'Summary!',
      language: 'en',
      link: 'http://www.vincelivemix.fr',
      copyright: '℗ & © 2011-2020 John Doe',
      author: 'John Doe',
      categories: ['Music'],
      image:
        'http://media.vincelivemix.fr/images/podcast/Live_Mix_Song_Cover-Recovered.jpg',
      explicit: 'clean',
      ownerName: 'John Doe',
      ownerEmail: 'email@me.com',
      keywords: 'Vince live mix, electro, house, edm, dj, mixing',
    });
  }

  describe('GET /api/rss', () => {
    it('should return 404 if no settings is not found', () => {
      return request(app.getHttpServer()).get('/api/rss').expect(404);
    });

    it('should return 200 if settings exists', async () => {
      await createItunesSettings();

      const response = await request(app.getHttpServer())
        .get('/api/rss')
        .expect('Content-Type', 'application/rss+xml; charset=utf-8')
        .expect(200);

      expect(response.text).toEqual(`<?xml version="1.0" encoding="utf-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vince Live Mix</title>
    <description>Summary!</description>
    <link>http://www.vincelivemix.fr</link>
    <language>en</language>
    <copyright>℗ &amp; © 2011-2020 John Doe</copyright>
    <lastBuildDate>${date.toUTCString()}</lastBuildDate>
    <atom:link href="http://www.vincelivemix.fr/api/rss" rel="self" type="application/rss+xml"/>
    <itunes:author>John Doe</itunes:author>
    <itunes:summary>Summary!</itunes:summary>
    <itunes:subtitle>Feel the vibe of the sound</itunes:subtitle>
    <itunes:owner>
      <itunes:name>John Doe</itunes:name>
      <itunes:email>email@me.com</itunes:email>
    </itunes:owner>
    <itunes:explicit>clean</itunes:explicit>
    <itunes:keywords>Vince live mix, electro, house, edm, dj, mixing</itunes:keywords>
    <itunes:image href="http://media.vincelivemix.fr/images/podcast/Live_Mix_Song_Cover-Recovered.jpg"/>
    <itunes:category text="Music"/>
  </channel>
</rss>`);
    });

    it('should return 200 with a list of episodes', async () => {
      await createItunesSettings();

      const episode = await episodeService.createEpisode({
        title: 'Live mix 74',
        number: 74,
        description: 'description',
        status: EpisodeStatus.PUBLISHED,
        coverImage:
          'http://media.vincelivemix.fr/images/episodes/Live+mix+74-cover.jpg',
        audioLink:
          'http://media.vincelivemix.fr/audio/episodes/Vince+Live+Mix+74.mp3',
        durationAudioInSecond: 2589,
        itunesDuration: '43:09',
        itunesSummary: 'Itunes summary',
        itunesImageLink:
          'http://media.vincelivemix.fr/images/episodes/Live+mix+74.jpg',
        itunesKeywords: [
          'house',
          'electro',
          'edm',
          'vince live mix',
          'live mix',
          'live mix 69',
          'big room',
        ],
        itunesExplicit: false,
      });

      const response = await request(app.getHttpServer())
        .get('/api/rss')
        .expect('Content-Type', 'application/rss+xml; charset=utf-8')
        .expect(200);

      expect(response.text).toEqual(`<?xml version="1.0" encoding="utf-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vince Live Mix</title>
    <description>Summary!</description>
    <link>http://www.vincelivemix.fr</link>
    <language>en</language>
    <copyright>℗ &amp; © 2011-2020 John Doe</copyright>
    <lastBuildDate>${date.toUTCString()}</lastBuildDate>
    <atom:link href="http://www.vincelivemix.fr/api/rss" rel="self" type="application/rss+xml"/>
    <itunes:author>John Doe</itunes:author>
    <itunes:summary>Summary!</itunes:summary>
    <itunes:subtitle>Feel the vibe of the sound</itunes:subtitle>
    <itunes:owner>
      <itunes:name>John Doe</itunes:name>
      <itunes:email>email@me.com</itunes:email>
    </itunes:owner>
    <itunes:explicit>clean</itunes:explicit>
    <itunes:keywords>Vince live mix, electro, house, edm, dj, mixing</itunes:keywords>
    <itunes:image href="http://media.vincelivemix.fr/images/podcast/Live_Mix_Song_Cover-Recovered.jpg"/>
    <itunes:category text="Music"/>
    <item>
      <title>Live mix 74</title>
      <description>description</description>
      <pubDate>${episode.publishedAt.toUTCString()}</pubDate>
      <guid>http://media.vincelivemix.fr/audio/episodes/Vince+Live+Mix+74.mp3</guid>
      <enclosure url="http://media.vincelivemix.fr/audio/episodes/Vince+Live+Mix+74.mp3" length="2589" type="audio/mp3"/>
      <itunes:duration>43:09</itunes:duration>
      <itunes:summary>Itunes summary</itunes:summary>
      <itunes:image href="http://media.vincelivemix.fr/images/episodes/Live+mix+74.jpg"/>
      <itunes:keywords>house,electro,edm,vince live mix,live mix,live mix 69,big room</itunes:keywords>
      <itunes:explicit>clean</itunes:explicit>
    </item>
  </channel>
</rss>`);
    });
  });
});
