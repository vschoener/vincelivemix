import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { TypeSettings } from '../types/settings.type';

@Entity()
export class Settings<T extends TypeSettings = {}> extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    unique: true,
  })
  public name: string;

  @Column({
    type: 'json',
  })
  public values: T;

  public constructor(settings: Partial<Settings<T>>) {
    super();

    Object.assign(this, settings);
  }
}
