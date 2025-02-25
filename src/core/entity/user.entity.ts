import { BaseEntity } from 'src/common/database/BaseEntity';
import { Entity, Column } from 'typeorm';
import { Roles } from "src/common/database/Enums";

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({
        type: 'enum',
        enum: Roles,
        default: Roles.USER,
    })
    role: Roles;
}
