import { Module } from '@nestjs/common';

import { UploadFileService } from './upload-file.service';
import { UploadFileController } from './upload-file.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UploadFileController],
  providers: [UploadFileService],
})
export class UploadFileModule {}
