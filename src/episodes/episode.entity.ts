import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { EpisodeStatus } from './episode.enum';

@Entity()
export class Episode extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({
    unique: true,
  })
  public number: number;

  @Column()
  public description: string;

  @Column()
  public status: EpisodeStatus;

  @Column({
    nullable: true,
  })
  public coverImage: string;

  @Column({
    nullable: true,
  })
  public audioLink: string;

  @Column({
    nullable: true,
  })
  public durationAudioInSecond: number;

  // iTunes fields (TODO: moved to an episode_itunes_metadata later)

  @Column({
    nullable: true,
  })
  public itunesDuration: string;

  @Column({
    nullable: true,
  })
  public itunesSummary: string;

  @Column({
    nullable: true,
  })
  public itunesImageLink: string;

  @Column({
    nullable: true,
  })
  public itunesKeywords: string;

  @Column({
    nullable: true,
    default: false,
  })
  public itunesExplicit: boolean;

  // Dates fields

  @Column({
    type: 'timestamptz',
  })
  public createdAt: Date;

  @Column({
    type: 'timestamptz',
  })
  public updatedAt: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  public publishedAt: Date;

  public constructor(episode: Partial<Episode> = {}) {
    super();

    Object.assign(this, episode);
  }
}
