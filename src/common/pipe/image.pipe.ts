import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class ImageValidationPipe implements PipeTransform<any> {
  private readonly allowedExtensions = [
    '.jpeg',
    '.jpg',
    '.png',
    '.svg',
    '.heic',
  ];

  transform(value: any) {
    if (!value || !value.originalname || !value.mimetype) {
      return value;
    }
    const fileExtension = extname(value.originalname).toLowerCase();
    if (!this.allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `Only image files (JPEG, JPG, PNG, SVG, HEIC) are allowed.`,
      );
    }
    return value;
  }
}
