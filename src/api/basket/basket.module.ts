import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from 'src/core/entity/basket.entity';
import { ProductEntity } from 'src/core/entity/product.entity';
import { ProductService } from '../product/product.service';
import { FileService } from 'src/common/multer/multer.service';
import { UserEntity } from 'src/core/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BasketEntity, ProductEntity, UserEntity])],
  controllers: [BasketController],
  providers: [BasketService, ProductService, FileService],
})
export class BasketModule {}
