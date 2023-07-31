import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { PrismaService } from '../prisma/prisma.service';
import { FileUploadModuleMessages } from 'src/utils/appMessges';

@Injectable()
export class UploadFileService {
  private s3: S3;
  constructor(private prisma: PrismaService, private readonly configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
    });
  }

  async uploadFile(file): Promise<any> {
    if (!file) throw new BadRequestException(FileUploadModuleMessages.BadRequestExceptionNotFoundFile);
    const { buffer, originalname } = file;
    try {
      var base64data = Buffer.from(buffer, 'binary');
      const uploadResult = await this.s3
        .upload({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Body: base64data,
          Key: `${uuid()}-${originalname}`,
        })
        .promise();

      return uploadResult;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteFile(fileKey): Promise<any> {
    try {
      const deletedFile = await this.s3
        .deleteObject({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: fileKey,
        })
        .promise();

      return deletedFile;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
