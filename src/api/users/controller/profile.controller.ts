import {
    Controller,
    Get,
    Patch,
    Delete,
    Body,
    Logger,
    UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { UserEntity } from "src/core/entity/user.entity";
import { CurrentUser } from "src/common/decorator/current-user";
import { JwtAuthGuard } from "../../../common/guard/AuthGuard";
import { UpdateUserDto } from "../dto/update-user.dto";
import { RolesDecorator } from "src/common/decorator/RolesDecorator";
import { Roles } from "src/common/database/Enums";
import { RolesGuard } from "src/common/guard/RoleGuard";
import { ProfileService } from "../service/profile.service";

@ApiTags("Profile")
@ApiBearerAuth('access-token')
@Controller("profile")
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @ApiOperation({ summary: "Get current user profile" })
    @RolesDecorator(Roles.USER, Roles.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('profile')
    async getCurrentUserProfile(
        @CurrentUser() currentUser: UserEntity,
    ): Promise<UserEntity> {
        return this.profileService.getCurrentUserById(currentUser.id);
    }

    @RolesDecorator(Roles.USER, Roles.ADMIN)
    @Patch('profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ status: 200, description: 'User updated', type: UserEntity })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateCurrentUserProfile(
        @Body() updateData: UpdateUserDto,
        @CurrentUser() currentUser: UserEntity,
    ): Promise<UserEntity> {
        return this.profileService.updateCurrentUser(currentUser.id, updateData, currentUser);
    }

    @RolesDecorator(Roles.USER, Roles.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('profile')
    @ApiOperation({ summary: "Soft delete current user profile" })
    @ApiResponse({ status: 200, description: "User soft deleted" })
    @ApiResponse({ status: 404, description: "User not found" })
    async deleteCurrentUserProfile(
        @CurrentUser() currentUser: UserEntity,
    ): Promise<void> {
        return this.profileService.softDeleteCurrentUser(currentUser.id, currentUser);
    }

}
