import {FileUploadOptions} from '@/external-service/file-storage/file-storage.types';

export interface FileStorageStrategy {
  uploadFile(
    file: Express.Multer.File,
    options?: FileUploadOptions,
  ): Promise<string>;

  uploadFileFromBuffer(
    fileBuffer: Buffer,
    fileName: string,
    options?: FileUploadOptions,
  ): Promise<string>;

  deleteFile(url: string): Promise<void>;
}
