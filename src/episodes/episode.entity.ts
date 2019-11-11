import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EpisodeStatus } from './episode.enum';

@Entity()
export class Episode extends BaseEntity {
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
    type: 'timestamptz',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
  })
  updatedAt: Date;
}
