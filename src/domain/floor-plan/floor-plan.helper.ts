import {Inject, Injectable} from '@nestjs/common';
import {ImageProcessingService} from '@/external-service/image-processing/image-processing.service';
import {FileManagementHelper} from '@/common/file-management-helper.service';
import {FileStorageService} from '@/external-service/file-storage/file-storage.service';

@Injectable()
export class FloorPlanHelper {
  constructor(
    @Inject(FileManagementHelper)
    private fileManagementHelper: FileManagementHelper,
  ) {}

  async uploadOriginalAndThumbsAndLargeFloorPlanImages(
    file: Express.Multer.File,
    fileName: string,
    fileExtension: string,
    imageProcessingService: ImageProcessingService,
    fileStorageService: FileStorageService,
  ) {
    return await Promise.all([
      fileStorageService.uploadFile(file, {
        acl: 'public-read',
        prefixFile: 'floor-plan',
      }),
      this.fileManagementHelper.resizeImageFileAndUpload(
        file,
        100,
        100,
        fileName,
        fileExtension,
        'public-read',
        'floor-plan',
        imageProcessingService,
        fileStorageService,
      ),
      this.fileManagementHelper.resizeImageFileAndUpload(
        file,
        2000,
        2000,
        fileName,
        fileExtension,
        'public-read',
        'floor-plan',
        imageProcessingService,
        fileStorageService,
      ),
    ]);
  }
}
