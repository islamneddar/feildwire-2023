import {Injectable} from '@nestjs/common';
import Path from 'path';

@Injectable()
export class FileUtils {
  getFileNameAndFileExtensionFromFile(file: Express.Multer.File) {
    const fileName = Path.parse(file.originalname).name.toLowerCase();
    const fileExtension = Path.parse(file.originalname).ext.toLowerCase();

    return {fileName, fileExtension};
  }
}
