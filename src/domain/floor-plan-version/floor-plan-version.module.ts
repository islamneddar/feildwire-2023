import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FloorPlanVersionEntity} from '@/domain/floor-plan-version/floor-plan-version.entity';
import {FloorPlanVersionController} from '@/domain/floor-plan-version/floor-plan-version.controller';
import {FloorPlanVersionService} from '@/domain/floor-plan-version/floor-plan-version.service';
import {AuthModule} from '@/domain/auth/auth.module';
import {UserModule} from '@/domain/user/user.module';
import {FloorPlanService} from '@/domain/floor-plan/floor-plan.service';
import {FloorPlanHelper} from '@/domain/floor-plan/floor-plan.helper';
import {FileUtils} from '@/utils/file.utils';
import {FileStorageService} from '@/external-service/file-storage/file-storage.service';
import {s3StorageProvider} from '@/external-service/file-storage/file-storage-provider';
import {ImageProcessingService} from '@/external-service/image-processing/image-processing.service';
import {sharpImageProcessingProvider} from '@/external-service/image-processing/image-processing-provider';
import {FileManagementHelper} from '@/common/file-management-helper.service';
import {FloorPlanModule} from '@/domain/floor-plan/floor-plan.module';
import {FloorPlanEntity} from '@/domain/floor-plan/floor-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FloorPlanVersionEntity, FloorPlanEntity]),
    AuthModule,
    UserModule,
    FloorPlanModule,
  ],
  controllers: [FloorPlanVersionController],
  providers: [
    FloorPlanVersionService,
    FloorPlanService,
    FloorPlanHelper,
    FileManagementHelper,
    FileUtils,
    FileStorageService,
    s3StorageProvider,
    ImageProcessingService,
    sharpImageProcessingProvider,
  ],
  exports: [FloorPlanVersionService],
})
export class FloorPlanVersionModule {}
