import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';

import { CreateProductReviewDto } from './dto/review-product.dto';
import { ReviewService } from './review.service';
import { ApiResponseTags } from 'src/utils/decorators/api-response-tags-decorator';

@Controller('product/review')
@ApiTags('Reviews Module')
@ApiResponseTags()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  createReview(@Body() createProductReviewDto: CreateProductReviewDto) {
    return this.reviewService.createReview(createProductReviewDto);
  }

  @Get('getByUser/:id')
  @ApiParam({ name: 'id' })
  getReviewsByUser(@Param('id') userId: string) {
    return this.reviewService.getReviewsByUser(userId);
  }

  @Get('getByProduct/:id')
  @ApiParam({ name: 'id' })
  getReviewsByProduct(@Param('id') productId: string) {
    return this.reviewService.getProductAllReview(productId);
  }
}
