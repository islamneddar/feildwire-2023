import {Injectable} from '@nestjs/common';
import {ImageProcessingService} from '@/external-service/image-processing/image-processing.service';
import {FileStorageService} from '@/external-service/file-storage/file-storage.service';

@Injectable()
export class FileManagementHelper {
  async resizeImageFileAndUpload(
    file: Express.Multer.File,
    width: number,
    height: number,
    fileName: string,
    fileExtension: string,
    acl: string,
    prefixFile: string,
    imageProcessingService: ImageProcessingService,
    fileStorageService: FileStorageService,
  ) {
    const resizedImageBuffer = await imageProcessingService.resizeImage(
      file,
      width,
      height,
    );

    return await fileStorageService.uploadFileFromBuffer(
      resizedImageBuffer,
      `${fileName}_${width}x${height}${fileExtension}`,
      {
        acl,
        prefixFile,
      },
    );
  }
}
