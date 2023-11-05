import {Inject, Injectable} from '@nestjs/common';
import {ImageProcessingStrategy} from '@/external-service/image-processing/image-processing-strategy-interface';

@Injectable()
export class ImageProcessingService {
  constructor(
    @Inject('ImageProcessingStrategy')
    private readonly imageProcessing: ImageProcessingStrategy,
  ) {}

  async resizeImage(
    file: Express.Multer.File,
    width: number,
    height: number,
  ): Promise<Buffer> {
    return this.imageProcessing.resizeImage(file, width, height);
  }
}
