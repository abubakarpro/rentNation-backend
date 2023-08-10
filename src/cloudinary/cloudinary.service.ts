import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { CloudinaryFileUploadMessages } from 'src/utils/appMessges';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadImage(file: Express.Multer.File): Promise<UploadApiErrorResponse | UploadApiResponse> {
    try {
      if (!file) throw new BadRequestException(CloudinaryFileUploadMessages.InvalidFile);
      const allowedExtensions = ['.png', '.jpg', '.gif', '.jpeg'];
      const fileExtension = '.' + file.originalname.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        throw new BadRequestException(CloudinaryFileUploadMessages.InvalidFileExtention);
      }
      return new Promise<UploadApiErrorResponse | UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'RentNation' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
