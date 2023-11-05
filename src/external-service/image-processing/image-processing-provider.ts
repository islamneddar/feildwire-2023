import {SharpImageProcessing} from '@/external-service/image-processing/image-processing-strategy/sharp-image-processing';

export const sharpImageProcessingProvider = {
  provide: 'ImageProcessingStrategy',
  useClass: SharpImageProcessing,
};
