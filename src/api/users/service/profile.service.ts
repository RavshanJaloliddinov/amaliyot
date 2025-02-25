import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "src/core/entity/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { Roles } from "src/common/database/Enums";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }



    async softDeleteUser(id: string, deletedBy: UserEntity): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        user.is_deleted = true;
        user.deleted_by = deletedBy;
        user.deleted_at = Date.now();
        await this.userRepository.save(user);
    }



    async getCurrentUserById(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { id, is_deleted: false },
            relations: ['created_by', 'updated_by']
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    async updateCurrentUser(
        id: string,
        updateData: Partial<UserEntity>,
        updatedBy: UserEntity,
    ): Promise<UserEntity> {
        const user = await this.getCurrentUserById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (Object.keys(updateData).length === 0) {
            throw new ConflictException('No data provided for update.');
        }

        Object.assign(user, updateData);

        if (updatedBy) {
            user.updated_by = updatedBy;
        }
        user.updated_at = Date.now();

        return this.userRepository.save(user);
    }

    async softDeleteCurrentUser(id: string, deletedBy: UserEntity): Promise<void> {

        const user = await this.getCurrentUserById(id);

        if (user.role === Roles.SUPER_ADMIN) {
            throw new ForbiddenException("You cannot delete a user with the SUPER_ADMIN role.")
        }

        user.is_deleted = true;
        user.deleted_by = deletedBy;
        user.deleted_at = Date.now();
        await this.userRepository.save(user);
    }

}
