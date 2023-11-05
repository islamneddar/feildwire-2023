import {ImageResizeOptions} from '@/external-service/image-processing/image-processing.type';
import sharp from 'sharp';
import {ImageProcessingStrategy} from '@/external-service/image-processing/image-processing-strategy-interface';
import * as Buffer from 'buffer';

export class SharpImageProcessing implements ImageProcessingStrategy {
  constructor() {}

  resizeImage(
    file: Express.Multer.File,
    width: number,
    height: number,
    options?: ImageResizeOptions,
  ): Promise<Buffer> {
    return sharp(file.buffer).resize(width, height, options).toBuffer();
  }
}
