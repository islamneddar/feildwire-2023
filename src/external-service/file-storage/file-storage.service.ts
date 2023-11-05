import {Injectable, Inject} from '@nestjs/common';
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
    return this.fileStorage.uploadFile(file, options);
  }

  async uploadFileFromBuffer(
    fileBuffer: Buffer,
    fileName: string,
    options?: FileUploadOptions,
  ): Promise<string> {
    return this.fileStorage.uploadFileFromBuffer(fileBuffer, fileName, options);
  }
}
