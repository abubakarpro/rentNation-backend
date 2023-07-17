import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
@ApiTags('Product Module')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll({});
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  update(@Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  // @Post(':userId/likes/:productId')
  // async likeProduct(
  //   @Param('userId') userId: number,
  //   @Param('productId') productId: number,
  // ) {
  //   await this.prisma.like.create({
  //     data: {
  //       userId,
  //       productId,
  //     },
  //   });

  //   return { message: 'Product liked successfully.' };
  // }

  // @Get(':userId/likes')
  // async getUserLikedProducts(@Param('userId') userId: number) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //     include: { likes: { include: { product: true } } },
  //   });

  //   return user?.likes.map((like) => like.product);
  // }
}
