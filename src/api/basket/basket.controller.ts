import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { RolesDecorator } from 'src/common/decorator/RolesDecorator';
import { Roles } from 'src/common/database/Enums';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guard/RoleGuard';
import { JwtAuthGuard } from 'src/common/guard/AuthGuard';
import { CurrentUser } from 'src/common/decorator/current-user';
import { UserEntity } from 'src/core/entity/user.entity';

@ApiTags('Baskets')
@ApiBearerAuth('access-token')
@Controller('baskets')
export class BasketController {
  constructor(private readonly basketService: BasketService) { }

  // Add product to basket
  @Post('add')
  @RolesDecorator(Roles.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Add product to basket' })
  @ApiResponse({ status: 201, description: 'Product added to basket' })
  addProduct(
    @Body() createBasketDto: CreateBasketDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.basketService.addProduct(createBasketDto, currentUser);
  }

  // Get all products in the basket
  @Get()
  @RolesDecorator(Roles.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all products in the basket' })
  @ApiResponse({ status: 200, description: 'List of basket products' })
  getBasket(@CurrentUser() currentUser: UserEntity) {
    return this.basketService.getBasket(currentUser);
  }

  // Update quantity of product in the basket
  @Patch('update/:id')
  @RolesDecorator(Roles.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update quantity of product in the basket' })
  @ApiParam({ name: 'id', type: 'string', description: 'Basket Item ID' })
  @ApiResponse({ status: 200, description: 'Basket product quantity updated' })
  updateQuantity(
    @Param('id') id: string,
    @Body() quantity: number,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.basketService.updateQuantity(id, quantity, currentUser);
  }

  // Remove product from basket
  @Delete('remove/:id')
  @RolesDecorator(Roles.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Remove product from basket' })
  @ApiParam({ name: 'id', type: 'string', description: 'Basket Item ID' })
  @ApiResponse({ status: 200, description: 'Product removed from basket' })
  removeProduct(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.basketService.removeProduct(id, currentUser);
  }

  // Clear the basket
  @Delete('clear')
  @RolesDecorator(Roles.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Clear the basket' })
  @ApiResponse({ status: 200, description: 'Basket cleared' })
  clearBasket(@CurrentUser() currentUser: UserEntity) {
    return this.basketService.clearBasket(currentUser);
  }
}
