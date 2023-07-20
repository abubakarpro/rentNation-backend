import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';

import { CreateCartDto } from './dto/create-cart.dto';
import { CartService } from './cart.service';
import { Role } from 'src/users/dto/role.enum';
import { RolesGuard } from 'src/users/auth/roles.guard';

@Controller('cart')
@ApiTags('Cart Module')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  createCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.createCart(createCartDto);
  }

  @Get()
  findAllCart() {
    return this.cartService.findAllCart({});
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOneCart(@Param('id') id: string) {
    return this.cartService.findOneCart(id);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Put(':id')
  @ApiParam({ name: 'id' })
  updateCart(@Param('id') id: string, @Body() updateCartDto) {
    return this.cartService.updateCart(id, updateCartDto);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Delete(':id')
  @ApiParam({ name: 'id' })
  removeCart(@Param('id') id: string) {
    return this.cartService.removeCart(id);
  }
}
