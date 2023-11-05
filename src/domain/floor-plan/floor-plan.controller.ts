import {
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  ParseFilePipeBuilder,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {AuthGuard} from '@/domain/auth/auth.guard';
import {FileInterceptor} from '@nestjs/platform-express';
import {CustomUploadFileTypeValidator} from '@/common/file-validator';
import {Request} from 'express';
import {CreateFloorPlanRequest} from '@/domain/floor-plan/floor-plan.dto';
import * as Path from 'path';
import {FloorPlanService} from '@/domain/floor-plan/floor-plan.service';
import {FloorPlanWithSameNameExistsForUserException} from '@/domain/floor-plan/floorplan.errors';
import {FileStorageService} from '@/external-service/file-storage/file-storage.service';
import {ImageProcessingService} from '@/external-service/image-processing/image-processing.service';
import {ObjectCannedACL} from '@aws-sdk/client-s3';
import {ProjectNotFoundException} from '@/domain/project/project.errors';
import {ProjectService} from '@/domain/project/project.service';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 100 * 1024 * 1024;
const VALID_UPLOADS_MIME_TYPES = ['image/jpeg', 'image/png'];

@Controller('floor-plan')
export class FloorPlanController {
  constructor(
    private floorPlanService: FloorPlanService,
    private fileStorageService: FileStorageService,
    private imageProcessingService: ImageProcessingService,
    private projectService: ProjectService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('floorPlanImage'))
  async createFloorPlan(
    @Req() req: Request,
    @Body() body: CreateFloorPlanRequest,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidator({
            fileType: VALID_UPLOADS_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({
          maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    const fileName = Path.parse(file.originalname).name.toLowerCase();
    const fileExtension = Path.parse(file.originalname).ext.toLowerCase();

    const floorPlan =
      await this.floorPlanService.getFloorPlanByNameNotDeletedForProjectIdForUser(
        fileName,
        body.projectId,
        req.user,
      );

    if (floorPlan) {
      throw new FloorPlanWithSameNameExistsForUserException();
    }

    const project = await this.projectService.getProjectByIdNotDeletedForUser(
      body.projectId,
      req.user,
    );

    if (!project) {
      throw new ProjectNotFoundException();
    }

    try {
      const results = await Promise.all([
        this.uploadFileToS3(file),
        this.resizeImageFileAndUpload(file, 100, 100, fileName, fileExtension),
        this.resizeImageFileAndUpload(
          file,
          2000,
          2000,
          fileName,
          fileExtension,
        ),
      ]);

      const floorPlan = await this.floorPlanService.createFloorPlan({
        name: fileName,
        originalImageUrl: results[0] as string,
        thumbnailImageUrl: results[1] as string,
        LargeImageUrl: results[2] as string,
        project,
      });

      return {
        floorPlanId: floorPlan.floorPlanId,
        name: floorPlan.name,
      };
    } catch (e) {
      console.log('all promise error => ', e);
      throw new InternalServerErrorException();
    }
  }

  private async resizeImageFileAndUpload(
    file: Express.Multer.File,
    width: number,
    height: number,
    fileName: string,
    fileExtension: string,
  ) {
    try {
      const resizedImageBuffer = await this.imageProcessingService.resizeImage(
        file,
        width,
        height,
      );

      return await this.fileStorageService.uploadFileFromBuffer(
        resizedImageBuffer,
        `${fileName}_${width}x${height}${fileExtension}`,
        {
          acl: 'public-read',
          prefixFile: 'floor-plan',
        },
      );
    } catch (e) {
      console.log('resizeImageFileAndUpload => ', e);
      throw new InternalServerErrorException();
    }
  }

  private async uploadFileToS3(file: Express.Multer.File): Promise<string> {
    try {
      return await this.fileStorageService.uploadFile(file, {
        acl: ObjectCannedACL.public_read,
        prefixFile: `floor-plan`,
      });
    } catch (error) {
      console.error(`Upload file error: ${error}`);
      throw new InternalServerErrorException();
    }
  }
}
