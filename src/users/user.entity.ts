import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  constructor(user: Partial<User> = {}) {
    super();

    Object.assign(this, user);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  encodedPassword: string;

  @Column('varchar', {
    array: true,
  })
  roles: string[];

  // Dates fields

  @Column({
    type: 'timestamptz',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
  })
  updatedAt: Date;

  isSuperAdmin: boolean = false;
}
