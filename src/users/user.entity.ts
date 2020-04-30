import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public email: string;

  @Column()
  public encodedPassword: string;

  @Column('varchar', {
    array: true,
  })
  public roles: string[];

  // Dates fields

  @Column({
    type: 'timestamptz',
  })
  public createdAt: Date;

  @Column({
    type: 'timestamptz',
  })
  public updatedAt: Date;

  public isSuperAdmin = false;

  public constructor(user: Partial<User> = {}) {
    super();

    Object.assign(this, user);
  }
}
