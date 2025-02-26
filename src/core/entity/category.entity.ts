import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class CategoryEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ example: 'c1e9b9e0-4f47-4eaa-93a7-9d9e0a2e6b3e', description: 'Category ID' })
    id: string;

    @Column()
    @ApiProperty({ example: 'Electronics', description: 'Category name' })
    name: string;

    @ManyToOne(() => CategoryEntity, (category) => category.children, { nullable: true, onDelete: 'SET NULL' })
    @ApiProperty({ example: null, description: 'Parent category' })
    parent: CategoryEntity;

    @OneToMany(() => CategoryEntity, (category) => category.parent)
    children: CategoryEntity[];
}
