import {FileStorageStrategy} from '@/external-service/file-storage/file-storage-strategy-interface';
import {ConfigService} from '@nestjs/config';
import {Inject, Logger} from '@nestjs/common';
import {
  ObjectCannedACL,
  PutObjectCommand,
  PutObjectCommandInput,
  S3,
} from '@aws-sdk/client-s3';
import {FileUploadOptions} from '@/external-service/file-storage/file-storage.types';
import {
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_S3_ENDPOINT,
  AWS_S3_REGION,
  AWS_SECRET_ACCESS_KEY,
} from '@/configs/env.constant';

export class S3FileStorageStrategy implements FileStorageStrategy {
  private s3Client: S3;

  private readonly bucketName: string;
  constructor(@Inject(ConfigService) private configService: ConfigService) {
    const awsAccessKeyId = configService.getOrThrow<string>(AWS_ACCESS_KEY_ID);
    const awsSecretAccessKey = configService.getOrThrow<string>(
      AWS_SECRET_ACCESS_KEY,
    );
    const awsS3Endpoint = configService.getOrThrow<string>(AWS_S3_ENDPOINT);

    this.s3Client = new S3({
      endpoint: awsS3Endpoint,
      region: configService.getOrThrow<string>(AWS_S3_REGION),
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    this.bucketName = configService.getOrThrow<string>(AWS_BUCKET_NAME);
  }

  async uploadFile(file: Express.Multer.File, options?: FileUploadOptions) {
    this.validateFileOptionArguments(options);
    const base64Data = file.buffer;
    const fileKey = `${
      options.prefixFile
    }/${Date.now()}-${file.originalname.toLowerCase()}`;
    return await this.s3Upload(
      base64Data,
      this.bucketName,
      fileKey,
      options.acl,
    );
  }

  async uploadFileFromBuffer(
    fileBuffer: Buffer,
    fileName: string,
    options?: FileUploadOptions,
  ) {
    this.validateFileOptionArguments(options);
    const fileKey = `${options.prefixFile}/${Date.now()}-${fileName}`;
    return await this.s3Upload(
      fileBuffer,
      this.bucketName,
      fileKey,
      options.acl,
    );
  }

  async deleteFile(url: string) {
    const s3ObjectKey = new URL(url).pathname.substring(1);

    await this.s3Client.deleteObject({
      Bucket: this.bucketName,
      Key: s3ObjectKey,
    });
  }

  private async s3Upload(
    fileBuffer: Buffer,
    bucketName: string,
    fileKey: string,
    acl: string,
  ) {
    if (!Object.values(ObjectCannedACL).includes(acl as any)) {
      throw new Error('Invalid ACL => ' + acl);
    }
    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: fileKey,
      Body: fileBuffer,
      ACL: ObjectCannedACL[acl],
    };

    try {
      await this.s3Client.send(new PutObjectCommand(params));
      // we can implement the same pattern strategy used with choosing which fileStorageStrategy we want to use here
      // to know on which provider of S3 bucket we use but due to time limit I will write the url directly
      return `https://${bucketName}.ams3.cdn.digitaloceanspaces.com/${fileKey}`;
    } catch (e) {
      Logger.error(e);
      throw new Error('Error while uploading file');
    }
  }

  private validateFileOptionArguments(options: FileUploadOptions) {
    if (!options || !options.acl || !options.prefixFile) {
      throw new Error('Missing File Upload Arguments');
    }
  }
}
