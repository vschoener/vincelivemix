export type ItunesSettingsDomainModel = {
  ownerName: string;
  ownerEmail: string;
  title: string;
  subtitle: string;
  summary: string;
  language: string;
  link: string;
  copyright: string;
  author: string;
  categories: string[];
  image: string;
  explicit: true | false | 'yes' | 'no' | 'clean';
  newFeedUrl?: string;
}
