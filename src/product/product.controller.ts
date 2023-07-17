import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductView } from './dto/update-product-view.dto';

@Controller('product')
@ApiTags('Product Module')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('searchingOnLocation')
  // @ApiParam({ name: 'id' })
  searchingOnLocation() {
    return this.productService.searchProductsByPlaceId("ChIJb7iwgl8BGTkR5gI96_35yi8");
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


  @Post(':userId/likes/:productId')
  async likeProduct(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
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
