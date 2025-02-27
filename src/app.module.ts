import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './api/auth/auth.module';
import { JwtStrategy } from './common/jwt/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './core/entity/user.entity';
import { JwtAuthGuard } from './common/guard/AuthGuard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guard/RoleGuard';
import { CategoryModule } from './api/category/category.module';
import { CategoryEntity } from './core/entity/category.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ProductModule } from './api/product/product.module';
import { ProductEntity } from './core/entity/product.entity';
import { BasketModule } from './api/basket/basket.module';
import { BasketEntity } from './core/entity/basket.entity';
import { OrderModule } from './api/order/order.module';
import { OrderEntity } from './core/entity/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DB_URL,
      synchronize: true,
      entities: [UserEntity, CategoryEntity, ProductEntity, BasketEntity, OrderEntity],
      ssl: false
    }),
    AuthModule,
    UsersModule,
    CategoryModule,
    ProductModule,
    MulterModule,
    BasketModule,
    OrderModule,
  ],
  providers: [
    JwtStrategy,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ]
})
export class AppModule { }
