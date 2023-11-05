import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {BaseTable} from '@/database/base-table.entity';
import {FloorPlanEntity} from '@/domain/floor-plan/floor-plan.entity';
import {UserEntity} from '@/domain/user/user.entity';

@Entity({name: 'projects'})
export class ProjectEntity extends BaseTable {
  @PrimaryGeneratedColumn('uuid', {
    name: 'project_id',
  })
  projectId: string;

  @Column({
    name: 'name',
    nullable: false,
  })
  name: string;

  @OneToMany(() => FloorPlanEntity, floorPlan => floorPlan.project)
  floorPlans: FloorPlanEntity[];

  @ManyToOne(() => UserEntity, user => user.projects)
  @JoinColumn({name: 'user_id'})
  user: UserEntity;
}
