import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { Role } from 'src/users/dto/role.enum';
import { RolesGuard } from 'src/users/auth/roles.guard';

@Controller('order')
@ApiTags('Order Module')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  findAllOrder() {
    return this.orderService.findAllOrder({});
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOneOrder(@Param('id') id: string) {
    return this.orderService.findOneOrder(id);
  }

  // @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Put(':id')
  @ApiParam({ name: 'id' })
  updateOrder(@Param('id') id: string, @Body() updateOrderDto) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Delete(':id')
  @ApiParam({ name: 'id' })
  removeOrder(@Param('id') id: string) {
    return this.orderService.removeOrder(id);
  }
}
