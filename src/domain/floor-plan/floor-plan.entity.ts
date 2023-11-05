import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import {BaseTable} from '@/database/base-table.entity';
import {ProjectEntity} from '@/domain/project/project.entity';

@Entity({name: 'floor_plans'})
export class FloorPlanEntity extends BaseTable {
  @PrimaryGeneratedColumn('uuid', {
    name: 'floor_plan_id',
  })
  floorPlanId: string;

  @Column({
    name: 'name',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'image_url',
    nullable: false,
  })
  imageUrl: string;

  @Column({
    name: 'thumbnail_url',
    nullable: false,
  })
  thumbnailUrl: string;

  @Column({
    name: 'large_image_url',
    nullable: false,
  })
  largeImageUrl: string;

  @ManyToOne(() => ProjectEntity, project => project.floorPlans, {
    nullable: false,
  })
  @JoinColumn({name: 'project_id'})
  project: ProjectEntity;
}
