import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/core/entity/order.entity';
import { UserEntity } from 'src/core/entity/user.entity';
import { ProductEntity } from 'src/core/entity/product.entity';
import { UserService } from '../users/service/users.service';
import { ProductService } from '../product/product.service';
import { FileService } from 'src/common/multer/multer.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, UserEntity, ProductEntity])],
  controllers: [OrderController],
  providers: [OrderService, UserService, ProductService, FileService],
})
export class OrderModule { }
