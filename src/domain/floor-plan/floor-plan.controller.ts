import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {AuthGuard} from '@/domain/auth/auth.guard';
import {FileInterceptor} from '@nestjs/platform-express';
import {Request} from 'express';
import {
  CreateFloorPlanRequest,
  UpdateFloorPlanRequest,
} from '@/domain/floor-plan/floor-plan.dto';

import {FloorPlanService} from '@/domain/floor-plan/floor-plan.service';
import {
  FloorPlanNotFoundException,
  FloorPlanWithSameNameExistsForUserException,
} from '@/domain/floor-plan/floorplan.errors';
import {FileStorageService} from '@/external-service/file-storage/file-storage.service';
import {ImageProcessingService} from '@/external-service/image-processing/image-processing.service';
import {ProjectNotFoundException} from '@/domain/project/project.errors';
import {ProjectService} from '@/domain/project/project.service';
import {customParseFilePipe} from '@/common/file.pipe';
import {FileUtils} from '@/utils/file.utils';
import {FloorPlanHelper} from '@/domain/floor-plan/floor-plan.helper';
import {
  MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
  VALID_UPLOADS_MIME_TYPES,
} from '@/common/floor-plans.constants';
import {FloorPlanVersionService} from '@/domain/floor-plan-version/floor-plan-version.service';

@Controller('floor-plan')
export class FloorPlanController {
  constructor(
    private floorPlanService: FloorPlanService,
    private fileStorageService: FileStorageService,
    private imageProcessingService: ImageProcessingService,
    private projectService: ProjectService,
    private fileUtils: FileUtils,
    private floorPlanHelper: FloorPlanHelper,
    private floorPlanVersionService: FloorPlanVersionService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('floorPlanImage'))
  async createFloorPlan(
    @Req() req: Request,
    @Body() body: CreateFloorPlanRequest,
    @UploadedFile(
      customParseFilePipe(
        VALID_UPLOADS_MIME_TYPES,
        MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
        true,
      ),
    )
    file: Express.Multer.File,
  ) {
    const {fileName, fileExtension} =
      this.fileUtils.getFileNameAndFileExtensionFromFile(file);

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

    const ImagesUrlsUploaded =
      await this.floorPlanHelper.uploadOriginalAndThumbsAndLargeFloorPlanImages(
        file,
        fileName,
        fileExtension,
        this.imageProcessingService,
        this.fileStorageService,
      );

    const floorPlanCreated = await this.floorPlanService.createFloorPlan({
      name: fileName,
      originalImageUrl: ImagesUrlsUploaded[0] as string,
      thumbnailImageUrl: ImagesUrlsUploaded[1] as string,
      LargeImageUrl: ImagesUrlsUploaded[2] as string,
      project,
    });

    await this.floorPlanVersionService.createFloorPlanVersion({
      floorPlan: floorPlanCreated,
      imageUrl: ImagesUrlsUploaded[0],
      thumbnailUrl: ImagesUrlsUploaded[1],
      largeImageUrl: ImagesUrlsUploaded[2],
      versionNumber: 1,
    });

    return {
      floorPlanId: floorPlanCreated.floorPlanId,
      name: floorPlanCreated.name,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getFloorPlanByIdForUser(@Param('id') id: string, @Req() req: Request) {
    const floorPlan =
      await this.floorPlanService.getFloorPlanByIdNotDeletedForUser(
        id,
        req.user,
      );

    if (!floorPlan) {
      throw new FloorPlanNotFoundException();
    }

    return {
      floorPlanId: floorPlan.floorPlanId,
      name: floorPlan.name,
      imageUrl: floorPlan.imageUrl,
      thumbnailUrl: floorPlan.thumbnailUrl,
      largeImageUrl: floorPlan.largeImageUrl,
      createdAt: floorPlan.createdAt,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/project/:projectId')
  async getFloorPlanByProjectIdForUser(
    @Param('projectId') projectId: string,
    @Req() req: Request,
  ) {
    const user = req.user;
    const project = await this.projectService.getProjectByIdNotDeletedForUser(
      projectId,
      user,
    );

    if (!project) {
      throw new ProjectNotFoundException();
    }

    const floorPlans =
      await this.floorPlanService.getAllFloorPlanByProjectIdForUser(
        projectId,
        user,
      );

    return floorPlans.map(floorPlan => ({
      floorPlanId: floorPlan.floorPlanId,
      name: floorPlan.name,
      imageUrl: floorPlan.imageUrl,
      thumbnailUrl: floorPlan.thumbnailUrl,
      largeImageUrl: floorPlan.largeImageUrl,
      createdAt: floorPlan.createdAt,
    }));
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('floorPlanImage'))
  async updateFloorPlan(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: UpdateFloorPlanRequest,
    @UploadedFile(
      customParseFilePipe(
        VALID_UPLOADS_MIME_TYPES,
        MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
        false,
      ),
    )
    file: Express.Multer.File,
  ) {
    if (!file && !body.name) {
      throw new UnprocessableEntityException(
        'You must provide either a file or a name to update the floor plan',
      );
    }
    const dataToUpdateInFloorPlan = {};
    const user = req.user;

    const floorPlan =
      await this.floorPlanService.getFloorPlanByIdNotDeletedForUser(id, user);

    if (!floorPlan) {
      throw new FloorPlanNotFoundException();
    }

    if (body.name) {
      const name = body.name.trim();
      const floorPlanWithSameName =
        await this.floorPlanService.getFloorPlanByNameNotDeletedForProjectIdForUser(
          name,
          floorPlan.project.projectId,
          user,
        );

      if (floorPlanWithSameName) {
        throw new FloorPlanWithSameNameExistsForUserException();
      }

      dataToUpdateInFloorPlan['name'] = name;
    }

    if (file) {
      const {fileName, fileExtension} =
        this.fileUtils.getFileNameAndFileExtensionFromFile(file);
      const uploadedImages =
        await this.floorPlanHelper.uploadOriginalAndThumbsAndLargeFloorPlanImages(
          file,
          fileName,
          fileExtension,
          this.imageProcessingService,
          this.fileStorageService,
        );

      const previousListImagesUrlsFloorPlan = [
        floorPlan.imageUrl,
        floorPlan.thumbnailUrl,
        floorPlan.largeImageUrl,
      ];

      this.fileStorageService.deleteMultipleFilesAsynchronous(
        previousListImagesUrlsFloorPlan,
        () => {
          Logger.log(
            `${previousListImagesUrlsFloorPlan.join(',')} deleted successfully`,
          );
        },
        error => {
          // we can add a system to keep track of files not already deleted to delete them later
          Logger.error('error in deleting files => ', error);
        },
      );

      dataToUpdateInFloorPlan['imageUrl'] = uploadedImages[0] as string;
      dataToUpdateInFloorPlan['thumbnailUrl'] = uploadedImages[1] as string;
      dataToUpdateInFloorPlan['largeImageUrl'] = uploadedImages[2] as string;
    }

    await this.floorPlanService.updateFloorPlan(floorPlan, {
      ...dataToUpdateInFloorPlan,
    });

    return {
      floorPlanId: floorPlan.floorPlanId,
      name: floorPlan.name,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteFloorPlan(@Param('id') id: string, @Req() req: Request) {
    const user = req.user;
    const floorPlan =
      await this.floorPlanService.getFloorPlanByIdNotDeletedForUser(id, user);

    if (!floorPlan) {
      throw new FloorPlanNotFoundException();
    }

    const {imageUrl, thumbnailUrl, largeImageUrl} = floorPlan;
    const listImagesUrlsFloorPlan = [imageUrl, thumbnailUrl, largeImageUrl];
    this.fileStorageService.deleteMultipleFilesAsynchronous(
      listImagesUrlsFloorPlan,
      () => {
        Logger.log(`${listImagesUrlsFloorPlan.join(',')} deleted successfully`);
      },
      error => {
        // we can add a system to keep track of files not already deleted to delete them later
        Logger.error('error in deleting files => ', error);
      },
    );

    await this.floorPlanService.deleteFloorPlan(floorPlan);

    return {
      message: 'Floor plan deleted successfully',
    };
  }
}
