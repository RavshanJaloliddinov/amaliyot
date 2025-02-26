import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Logger,
  NotFoundException,
  UseGuards,
  Post,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { UserEntity } from "src/core/entity/user.entity";
import { UserService } from "../service/users.service";
import { CurrentUser } from "src/common/decorator/current-user";
import { JwtAuthGuard } from "../../../common/guard/AuthGuard";
import { UpdateUserDto } from "../dto/update-user.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { RolesDecorator } from "src/common/decorator/RolesDecorator";
import { Roles } from "src/common/database/Enums";
import { RolesGuard } from "src/common/guard/RoleGuard";
import { Public } from "src/common/decorator/public.decorator";

@ApiTags("Users")
@ApiBearerAuth('access-token')
@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "List of all users", type: [UserEntity] })
  @RolesDecorator(Roles.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()

  async getAllUsers(): Promise<UserEntity[]> {
    this.logger.log("Fetching all users");
    return this.userService.getAllUsers();
  }

  @Get('deleted')
  @RolesDecorator(Roles.SUPER_ADMIN)
  async getAllDeletedUsers(): Promise<UserEntity[]> {
    this.logger.log("Fetching all users");
    return this.userService.getAllDeletedUsers();
  }

  @ApiOperation({ summary: "Get user by ID" })
  @RolesDecorator(Roles.SUPER_ADMIN)
  @ApiResponse({ status: 200, description: "User found", type: UserEntity })
  @ApiResponse({ status: 404, description: "User not found" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(":id")
  async getUserById(@Param("id") id: string): Promise<UserEntity> {
    this.logger.log(`Fetching user with ID: ${id}`);
    const user = await this.userService.getUserById(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException("User not found");
    }
    return user;
  }


  @ApiOperation({ summary: "Create new user" })
  @RolesDecorator(Roles.SUPER_ADMIN, Roles.USER, Roles.ADMIN)
  @ApiResponse({ status: 201, description: "User created", type: UserEntity })
  @ApiResponse({ status: 409, description: "User with this email already exists" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<UserEntity> {
    this.logger.log(`Creating new user by ${currentUser.id}`);
    return this.userService.createUser(createUserDto, currentUser);
  }

  @Patch(':id')
  @RolesDecorator(Roles.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User updated', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto, // Shu yerda UpdateUserDto ishlatilmoqda
    @CurrentUser() currentUser: UserEntity,
  ): Promise<UserEntity> {
    this.logger.log(`Updating user with ID: ${id} by ${currentUser.id}`);
    return this.userService.updateUser(id, updateData, currentUser);
  }


  @ApiOperation({ summary: "Soft delete user" })
  @RolesDecorator(Roles.SUPER_ADMIN)
  @ApiResponse({ status: 200, description: "User soft deleted" })
  @ApiResponse({ status: 404, description: "User not found" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  async deleteUser(
    @Param("id") id: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<void> {
    this.logger.log(`Soft deleting user with ID: ${id} by ${currentUser.id}`);
    return this.userService.softDeleteUser(id, currentUser);
  }

}
