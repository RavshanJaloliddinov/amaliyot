import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { join, extname } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FileService {
  private readonly uploadsFolder = join(process.cwd(), 'uploads');

  constructor() {
    // Uploads papkasini yaratish
    fs.mkdir(this.uploadsFolder, { recursive: true }).catch(() => null);
  }

  // Faylni saqlash va unique nom berish
  async saveFile(file: Express.Multer.File): Promise<string> {
    try {
      await fs.mkdir(this.uploadsFolder, { recursive: true });

      // Fayl nomi uchun unique nom yaratish
      const fileName = `${uuidv4()}${extname(file.originalname).toLowerCase()}`;
      const filePath = join(this.uploadsFolder, fileName);

      await fs.writeFile(filePath, file.buffer);

      return `/uploads/${fileName}`;
    } catch (error) {
      throw new BadRequestException(`Error saving file: ${error.message}`);
    }
  }

  // Faylni o'chirish
  async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = join(this.uploadsFolder, filePath);

      if (!(await this.fileExists(fullPath))) {
        throw new BadRequestException('File not found');
      }

      await fs.unlink(fullPath);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error deleting file');
    }
  }

  // Fayl mavjudligini tekshirish
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
