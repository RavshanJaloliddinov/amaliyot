// src/core/entity/order.entity.ts
import {
    Entity,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { UserEntity } from 'src/core/entity/user.entity';
  import { ProductEntity } from 'src/core/entity/product.entity';
  import { BaseEntity } from 'src/common/database/BaseEntity';
  
  @Entity('orders')
  export class OrderEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: 'CASCADE' })
    user: UserEntity;
  
    @ManyToOne(() => ProductEntity, (product) => product.orders, { onDelete: 'CASCADE' })
    product: ProductEntity;
  
    @Column({ type: 'int' })
    quantity: number;
  
    @Column({ type: 'enum', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' })
    status: string;
  }
  