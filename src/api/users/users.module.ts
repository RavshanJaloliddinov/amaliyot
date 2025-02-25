import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/entity/user.entity';
import { UserService } from './service/users.service';
import { UserController } from './controller/users.controller';
import { ProfileController } from './controller/profile.controller';
import { ProfileService } from './service/profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, ProfileService],
  controllers: [UserController, ProfileController],
})
export class UsersModule { }
