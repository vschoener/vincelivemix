import { CreateEpisodeDto } from '../../src/episodes/dto/create-episode.dto';
import { EpisodeStatus } from '../../src/episodes/episode.enum';

export const createPublishedEpisodeDto: CreateEpisodeDto = {
  audioLink: 'http://www.audio-link.test',
  coverImage: 'http://www.cover-link.test',
  description: 'description',
  durationAudioInSecond: 3600,
  itunesDuration: '01:00:00',
  itunesExplicit: false,
  itunesImageLink: 'http://www.itunes-images-link.test',
  itunesKeywords: ['electro'],
  itunesSummary: 'itunes summary must be long enough so here is some text',
  number: 1,
  publishedAt: new Date('2020-07-06T12:03:18.964Z'),
  status: EpisodeStatus.PUBLISHED,
  title: 'Live mix 1',
};
