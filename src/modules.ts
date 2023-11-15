import {AuthModule} from '@/domain/auth/auth.module';
import {ProjectModule} from '@/domain/project/project.module';
import {FloorPlanModule} from '@/domain/floor-plan/floor-plan.module';
import {FloorPlanVersionModule} from '@/domain/floor-plan-version/floor-plan-version.module';

export const Modules = [
  AuthModule,
  ProjectModule,
  FloorPlanModule,
  FloorPlanVersionModule,
];
