import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TypeSettings } from '../types/settings.type';

@Entity()
export class Settings<T extends TypeSettings = {}> extends BaseEntity {
  constructor(settings: Partial<Settings<T>>) {
    super();

    Object.assign(this, settings);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  name: string;

  @Column({
    type: 'json'
  })
  values: T
}
