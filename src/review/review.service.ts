import { Injectable, BadRequestException } from '@nestjs/common';
import { Review } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { ProductService } from '../product/product.service';

const BadRequestExceptionInvalid = 'Invalid ID';
const BadRequestExceptionNotFoundErrorMessage = 'Entity with ID not found';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly productService: ProductService
  ) {}

  async createReview(createProductReviewDto): Promise<Review> {
    const {userId, productId, name, reviewComments, stars} = createProductReviewDto;
    try {
      await this.userService.findOne(userId);
      await this.productService.findOne(productId);
  
      const reviewData = await this.prisma.review.create({
        data: {
          name,
          reviewComments,
          userId,
          productId,
          stars
        },
        include:{
          user:true,
          product: true
        },
      });
      return reviewData;
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async getProductAllReview(productId: string): Promise<Review[]> {
    try {
      const reviews = await this.prisma.review.findMany({
        where: {
          productId: productId,
        },
        include:{
          user:true,
          product:true
        }
      });
      return reviews;
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    try {
      const reviews = await this.prisma.review.findMany({
        where: {
          userId: userId,
        },
        include:{
          user:true,
          product:true
        }
      });
      return reviews;
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }
}
