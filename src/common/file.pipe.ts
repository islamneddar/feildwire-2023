import {HttpStatus, ParseFilePipeBuilder} from '@nestjs/common';
import {CustomUploadFileTypeValidator} from '@/common/file-validator/file-type-validator';

export const customParseFilePipe = (
  validUploadMimeType: string[],
  maxFileSizeInBytes: number,
  required: boolean = true,
) => {
  return new ParseFilePipeBuilder()
    .addValidator(
      new CustomUploadFileTypeValidator({
        fileType: validUploadMimeType,
      }),
    )
    .addMaxSizeValidator({
      maxSize: maxFileSizeInBytes,
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      fileIsRequired: required,
    });
};
