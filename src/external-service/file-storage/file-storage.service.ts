import {Injectable, Inject, Logger} from '@nestjs/common';
import {FileStorageStrategy} from '@/external-service/file-storage/file-storage-strategy-interface';
import {FileUploadOptions} from '@/external-service/file-storage/file-storage.types';

@Injectable()
export class FileStorageService {
  constructor(
    @Inject('FileStorageStrategy')
    private readonly fileStorage: FileStorageStrategy,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    options?: FileUploadOptions,
  ): Promise<string> {
    try {
      return this.fileStorage.uploadFile(file, options);
    } catch (e) {
      Logger.error('error in uploading file : ', e);
      throw e;
    }
  }

  async uploadFileFromBuffer(
    fileBuffer: Buffer,
    fileName: string,
    options?: FileUploadOptions,
  ): Promise<string> {
    return this.fileStorage.uploadFileFromBuffer(fileBuffer, fileName, options);
  }

  async deleteFile(url: string): Promise<void> {
    return this.fileStorage.deleteFile(url);
  }

  async deleteMultipleFilesAsynchronous(
    urls: string[],
    onSuccess: () => void,
    onFailure: (error: any) => void,
  ): Promise<void> {
    Promise.all(
      urls.map(imageUrl => {
        return this.deleteFile(imageUrl);
      }),
    )
      .then(() => {
        onSuccess();
      })
      .catch(error => {
        // we can implement a retry system or a queue that will delete those file later
        onFailure(error);
      });
  }
}
