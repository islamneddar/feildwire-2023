import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {BaseTable} from '@/database/base-table.entity';
import {FloorPlanEntity} from '@/domain/floor-plan/floor-plan.entity';

// todo - manage the same version number for the same floor plan
@Entity('floor_plan_versions')
export class FloorPlanVersionEntity extends BaseTable {
  @PrimaryGeneratedColumn('uuid', {
    name: 'floor_plan_version_id',
  })
  floorPlanVersionId: string;

  @Column({
    name: 'version_number',
    nullable: false,
  })
  versionNumber: number;

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

  @ManyToOne(() => FloorPlanEntity, floorPlan => floorPlan.floorPlanVersions)
  @JoinColumn({name: 'floor_plan_id'})
  floorPlan: FloorPlanEntity;
}
