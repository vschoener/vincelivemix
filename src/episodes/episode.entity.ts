import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EpisodeStatus } from './episode.enum';

@Entity()
export class Episode extends BaseEntity {
  constructor(episode: Partial<Episode> = {}) {
    super();

    Object.assign(this, episode);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    unique: true,
  })
  number: number;

  @Column()
  description: string;

  @Column()
  status: EpisodeStatus;

  @Column({
    nullable: true,
  })
  coverImage: string;

  @Column({
    nullable: true,
  })
  audioLink: string;

  @Column({
    nullable: true,
  })
  durationAudioInSecond: number;

  // iTunes fields (TODO: moved to an episode_itunes_metadata later)

  @Column({
    nullable: true,
  })
  itunesDuration: string;

  @Column({
    nullable: true,
  })
  itunesSummary: string;

  @Column({
    nullable: true,
  })
  itunesImageLink: string;

  @Column({
    nullable: true,
  })
  itunesKeywords: string;

  @Column({
    nullable: true,
    default: false
  })
  itunesExplicit: boolean;

  // Dates fields

  @Column({
    type: 'timestamptz',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @Column({
    type: 'timestamptz',
  })
  publishedAt: Date;
}
