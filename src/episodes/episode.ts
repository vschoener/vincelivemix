export enum EpisodeStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  DISABLE = 'disabled',
}

export class Episode {
  id: string;
  title: string;
  number: number;
  description: string;
  status: EpisodeStatus;
}
