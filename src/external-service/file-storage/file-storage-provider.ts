import {S3FileStorageStrategy} from '@/external-service/file-storage/file-upload-strategy/s3-file-storage';

export const s3StorageProvider = {
  provide: 'FileStorageStrategy',
  useClass: S3FileStorageStrategy,
};
