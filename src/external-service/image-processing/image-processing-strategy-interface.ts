import {ImageResizeOptions} from '@/external-service/image-processing/image-processing.type';

export interface ImageProcessingStrategy {
  resizeImage(
    file: Express.Multer.File,
    width: number,
    height: number,
    options?: ImageResizeOptions,
  ): Promise<Buffer>;
}
