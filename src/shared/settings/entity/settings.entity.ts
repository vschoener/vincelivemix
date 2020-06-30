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
