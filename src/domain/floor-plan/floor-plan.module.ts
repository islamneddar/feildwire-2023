import {Module} from '@nestjs/common';
import {FloorPlanController} from '@/domain/floor-plan/floor-plan.controller';
import {FloorPlanService} from '@/domain/floor-plan/floor-plan.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FloorPlanEntity} from '@/domain/floor-plan/floor-plan.entity';
import {AuthModule} from '@/domain/auth/auth.module';
import {UserModule} from '@/domain/user/user.module';
import {FileStorageService} from '@/external-service/file-storage/file-storage.service';
import {s3StorageProvider} from '@/external-service/file-storage/file-storage-provider';
import {ImageProcessingService} from '@/external-service/image-processing/image-processing.service';
import {sharpImageProcessingProvider} from '@/external-service/image-processing/image-processing-provider';
import {ProjectModule} from '@/domain/project/project.module';
import {FileUtils} from '@/utils/file.utils';
import {FloorPlanHelper} from '@/domain/floor-plan/floor-plan.helper';
import {FileManagementHelper} from '@/common/file-management-helper.service';
import {FloorPlanVersionService} from '@/domain/floor-plan-version/floor-plan-version.service';
import {FloorPlanVersionEntity} from '@/domain/floor-plan-version/floor-plan-version.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FloorPlanEntity, FloorPlanVersionEntity]),
    AuthModule,
    UserModule,
    ProjectModule,
  ],
  controllers: [FloorPlanController],
  providers: [
    FloorPlanService,
    FileStorageService,
    s3StorageProvider,
    ImageProcessingService,
    sharpImageProcessingProvider,
    FileUtils,
    FileManagementHelper,
    FloorPlanHelper,
    FloorPlanVersionService,
  ],
  exports: [],
})
export class FloorPlanModule {}
