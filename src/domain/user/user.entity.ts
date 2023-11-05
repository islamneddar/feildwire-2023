import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {BaseTable} from '@/database/base-table.entity';
import {ProjectEntity} from '@/domain/project/project.entity';

@Entity({name: 'users'})
export class UserEntity extends BaseTable {
  @PrimaryGeneratedColumn('uuid', {
    name: 'user_id',
  })
  userId: string;

  @Column({
    name: 'email',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    name: 'password',
    nullable: false,
  })
  password: string;

  @OneToMany(() => ProjectEntity, project => project.user)
  projects: ProjectEntity[];
}
