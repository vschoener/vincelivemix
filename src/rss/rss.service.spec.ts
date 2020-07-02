import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';

import { loggerSettings } from '../core/logger/logger.settings';
import { SettingsService } from '../settings/settings.service';
import { xmlElementProvider } from './providers/xml-element.provider';
import { EpisodesService } from '../episodes/episodes.service';
import { DateManagerService } from '../core/date/date-manager.service';
import { RssService } from './rss.service';
import { ItunesSettingsDomainModel } from '../settings/domain-models/itunes-settings.domain-model';
import { Episode } from '../episodes/episode.entity';
import { EpisodeStatus } from '../episodes/episode.enum';

describe('RssService', () => {
  let settingsService: jest.Mocked<SettingsService>;
  let episodeService: jest.Mocked<EpisodesService>;
  let rssService: RssService;
  let dateManagerService: DateManagerService;

  const date = new Date();
  const itunesSettingsDomainModel: ItunesSettingsDomainModel = {
    title: 'Vince Live Mix',
    subtitle: 'Feel the vibe of the sound',
    summary: 'summary',
    language: 'en',
    link: 'http://www.vincelivemix.fr',
    copyright: '℗ & © 2011-2020 John Doe',
    author: 'John Doe',
    categories: ['Music'],
    image:
      'http://media.vincelivemix.fr/images/podcast/Live_Mix_Song_Cover-Recovered.jpg',
    explicit: 'clean',
    ownerName: 'John Doe',
    ownerEmail: 'some@email.com',
    keywords: 'Vince live mix, electro, house, edm, dj, mixing',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WinstonModule.forRoot(loggerSettings)],
      providers: [
        xmlElementProvider,
        DateManagerService,
        RssService,
        {
          provide: EpisodesService,
          useValue: {
            getPublishedEpisode: jest.fn(),
          },
        },
        {
          provide: SettingsService,
          useValue: {
            getSetting: jest.fn(),
          },
        },
      ],
    }).compile();

    settingsService = module.get(SettingsService);
    episodeService = module.get(EpisodesService);
    rssService = module.get(RssService);
    dateManagerService = module.get(DateManagerService);

    settingsService.getSetting.mockResolvedValue(itunesSettingsDomainModel);
    jest.spyOn(dateManagerService, 'getNewDate').mockReturnValue(date);
  });

  describe('generate', () => {
    it('should generate rss using itunes settings', async () => {
      episodeService.getPublishedEpisode.mockResolvedValue([]);

      expect(await rssService.generate())
        .toEqual(`<?xml version="1.0" encoding="utf-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vince Live Mix</title>
    <description>summary</description>
    <link>http://www.vincelivemix.fr</link>
    <language>en</language>
    <copyright>℗ &amp; © 2011-2020 John Doe</copyright>
    <lastBuildDate>${date.toUTCString()}</lastBuildDate>
    <atom:link href="http://www.vincelivemix.fr/api/rss" rel="self" type="application/rss+xml"/>
    <itunes:author>John Doe</itunes:author>
    <itunes:summary>summary</itunes:summary>
    <itunes:subtitle>Feel the vibe of the sound</itunes:subtitle>
    <itunes:owner>
      <itunes:name>John Doe</itunes:name>
      <itunes:email>some@email.com</itunes:email>
    </itunes:owner>
    <itunes:explicit>clean</itunes:explicit>
    <itunes:keywords>Vince live mix, electro, house, edm, dj, mixing</itunes:keywords>
    <itunes:image href="http://media.vincelivemix.fr/images/podcast/Live_Mix_Song_Cover-Recovered.jpg"/>
    <itunes:category text="Music"/>
  </channel>
</rss>`);

      expect(settingsService.getSetting).toHaveBeenCalledWith('itunes');
    });

    it('should generate rss including items (episodes)', async () => {
      const episodes: Episode[] = [
        new Episode({
          title: 'Live mix 74',
          number: 74,
          description: '',
          status: EpisodeStatus.PUBLISHED,
          coverImage:
            'http://media.vincelivemix.fr/images/episodes/Live+mix+74-cover.jpg',
          audioLink:
            'http://media.vincelivemix.fr/audio/episodes/Vince+Live+Mix+74.mp3',
          durationAudioInSecond: 2589,
          itunesDuration: '43:09',
          itunesSummary: 'summary',
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
          ].join(','),
          itunesExplicit: false,
          publishedAt: date,
        }),
      ];

      episodeService.getPublishedEpisode.mockResolvedValue(episodes);

      expect(await rssService.generate())
        .toEqual(`<?xml version="1.0" encoding="utf-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vince Live Mix</title>
    <description>summary</description>
    <link>http://www.vincelivemix.fr</link>
    <language>en</language>
    <copyright>℗ &amp; © 2011-2020 John Doe</copyright>
    <lastBuildDate>${date.toUTCString()}</lastBuildDate>
    <atom:link href="http://www.vincelivemix.fr/api/rss" rel="self" type="application/rss+xml"/>
    <itunes:author>John Doe</itunes:author>
    <itunes:summary>summary</itunes:summary>
    <itunes:subtitle>Feel the vibe of the sound</itunes:subtitle>
    <itunes:owner>
      <itunes:name>John Doe</itunes:name>
      <itunes:email>some@email.com</itunes:email>
    </itunes:owner>
    <itunes:explicit>clean</itunes:explicit>
    <itunes:keywords>Vince live mix, electro, house, edm, dj, mixing</itunes:keywords>
    <itunes:image href="http://media.vincelivemix.fr/images/podcast/Live_Mix_Song_Cover-Recovered.jpg"/>
    <itunes:category text="Music"/>
    <item>
      <title>Live mix 74</title>
      <description/>
      <pubDate>${date.toUTCString()}</pubDate>
      <guid>http://media.vincelivemix.fr/audio/episodes/Vince+Live+Mix+74.mp3</guid>
      <enclosure url="http://media.vincelivemix.fr/audio/episodes/Vince+Live+Mix+74.mp3" length="2589" type="audio/mp3"/>
      <itunes:duration>43:09</itunes:duration>
      <itunes:summary>summary</itunes:summary>
      <itunes:image href="http://media.vincelivemix.fr/images/episodes/Live+mix+74.jpg"/>
      <itunes:keywords>house,electro,edm,vince live mix,live mix,live mix 69,big room</itunes:keywords>
      <itunes:explicit>clean</itunes:explicit>
    </item>
  </channel>
</rss>`);
    });
  });
});
