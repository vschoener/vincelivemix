import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EpisodeStatus } from './episode';

@Entity()
export class Episode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  number: number;

  @Column()
  description: string;

  @Column()
  status: EpisodeStatus;
}
