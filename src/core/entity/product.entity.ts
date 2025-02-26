// src/modules/product/entities/product.entity.ts
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/database/BaseEntity';
import { ProductStatus } from 'src/common/database/Enums';

@Entity('product')
export class ProductEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.AVAILABLE })
    status: ProductStatus;

    @Column({ type: 'varchar', nullable: true })
    image: string;
}
