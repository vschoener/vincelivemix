import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Settings<T = Record<string, unknown>> extends BaseEntity {
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

export const NAME_CONSTRAINT = 'UQ_ca7857276d2a30f4dcfa0e42cd4';
