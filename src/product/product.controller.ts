import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductView } from './dto/update-product-view.dto';

@Controller('product')
@ApiTags('Product Module')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('searchByLocation/:id')
  @ApiParam({ name: 'id' })
  searchProductsByLocation(@Param('id') placeId: string) {
    return this.productService.searchProductsByLocation(placeId);
  }

  @Get('getByCategory/:id')
  @ApiParam({ name: 'id' })
  productsFilteredByCategory(
    @Param('id') id: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.productService.productsFilteredByCategory(id, fromDate, toDate);
  }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  findAllProducts() {
    return this.productService.findAllProducts({});
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOneProduct(@Param('id') id: string) {
    return this.productService.findOneProduct(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  updateProduct(@Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  removeProduct(@Param('id') id: string) {
    return this.productService.removeProduct(id);
  }

  @Post(':userId/likes/:productId')
  async likeProduct(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.productService.likeProduct(userId, productId);
  }

  @Get(':userId/likes')
  async getUserLikedProducts(@Param('userId') userId: string) {
    return this.productService.getProductsByUserLikes(userId);
  }

  @Put('updateView/:id')
  @ApiParam({ name: 'id' })
  updateViewCounter(@Param('id') productId: string, @Body() counterBody: UpdateProductView) {
    return this.productService.updateViewCounter(productId, counterBody);
  }
}
