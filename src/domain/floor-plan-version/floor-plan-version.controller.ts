import {
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {AuthGuard} from '@/domain/auth/auth.guard';
import {FileInterceptor} from '@nestjs/platform-express';
import {customParseFilePipe} from '@/common/file.pipe';
import {
  MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
  VALID_UPLOADS_MIME_TYPES,
} from '@/common/floor-plans.constants';
import {Request} from 'express';
import {FloorPlanVersionService} from '@/domain/floor-plan-version/floor-plan-version.service';
import {FloorPlanService} from '@/domain/floor-plan/floor-plan.service';
import {FloorPlanNotFoundException} from '@/domain/floor-plan/floorplan.errors';
import {FloorPlanHelper} from '@/domain/floor-plan/floor-plan.helper';
import {FileUtils} from '@/utils/file.utils';
import {FileStorageService} from '@/external-service/file-storage/file-storage.service';
import {ImageProcessingService} from '@/external-service/image-processing/image-processing.service';

@Controller('floor-plan-version')
export class FloorPlanVersionController {
  constructor(
    private floorPlanVersionService: FloorPlanVersionService,
    private floorPlanService: FloorPlanService,
    private floorPlanHelper: FloorPlanHelper,
    private fileUtils: FileUtils,
    private imageProcessingService: ImageProcessingService,
    private fileStorageService: FileStorageService,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('floorPlanImageVersion'))
  @Post(':floorPlanId')
  async createFloorPlanVersion(
    @Param('floorPlanId') floorPlanId: string,
    @UploadedFile(
      customParseFilePipe(
        VALID_UPLOADS_MIME_TYPES,
        MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
        true,
      ),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const floorPlan =
      await this.floorPlanService.getFloorPlanByIdNotDeletedForUser(
        floorPlanId,
        req.user,
      );

    if (!floorPlan) {
      throw new FloorPlanNotFoundException();
    }

    const {fileName, fileExtension} =
      this.fileUtils.getFileNameAndFileExtensionFromFile(file);
    const ImagesUrlsUploaded =
      await this.floorPlanHelper.uploadOriginalAndThumbsAndLargeFloorPlanImages(
        file,
        fileName,
        fileExtension,
        this.imageProcessingService,
        this.fileStorageService,
      );

    const latestFloorPlanVersion =
      await this.floorPlanVersionService.getLatestFloorPlanVersionByFloorPlanId(
        floorPlanId,
      );

    await this.floorPlanVersionService.createFloorPlanVersion({
      floorPlan: floorPlan,
      imageUrl: ImagesUrlsUploaded[0],
      thumbnailUrl: ImagesUrlsUploaded[1],
      largeImageUrl: ImagesUrlsUploaded[2],
      versionNumber: latestFloorPlanVersion.versionNumber + 1,
    });

    return {
      message: 'Floor plan version created successfully',
    };
  }
}
