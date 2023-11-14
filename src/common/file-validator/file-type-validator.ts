import {FileValidator} from '@nestjs/common';
import * as fileType from 'file-type-mime';
export interface CustomUploadTypeValidatorOptions {
  fileType: string[];
}

export class CustomUploadFileTypeValidator extends FileValidator {
  private allowedMimeTypes: string[];

  constructor(
    protected readonly validationOptions: CustomUploadTypeValidatorOptions,
  ) {
    super(validationOptions);
    this.allowedMimeTypes = this.validationOptions.fileType;
  }

  public isValid(file?: Express.Multer.File): boolean {
    try {
      const response = fileType.parse(file.buffer);
      return this.allowedMimeTypes.includes(response.mime);
    } catch (e) {
      return false;
    }
  }

  public buildErrorMessage(): string {
    return `Upload not allowed. Upload only files of type: ${this.allowedMimeTypes.join(
      ', ',
    )}`;
  }
}
