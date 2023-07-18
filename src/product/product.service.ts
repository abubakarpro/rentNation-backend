import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { Product, Prisma, Like } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { ProductModuleMessages } from 'src/utils/appMessges';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService, private readonly userService: UsersService) {}

  async create(createProductDto): Promise<Product> {
    try {
      const {
        name,
        categoryId,
        quantity,
        pricePerDay,
        description,
        properties,
        location,
        discountPerWeek,
        availableFrom,
        availableTo,
        images,
      } = createProductDto;
      const categoryExists = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
        select: {
          id: true,
        },
      });

      if (!categoryExists) {
        throw new Error(ProductModuleMessages.ErrorMessage);
      }
      const product = await this.prisma.product.create({
        data: {
          name: name,
          quantity: quantity,
          pricePerDay: pricePerDay,
          description: description,
          properties: properties,
          location: location,
          availableFrom: availableFrom,
          availableTo: availableTo,
          discountPerWeek: discountPerWeek,
          images: images,
          category: {
            connect: {
              id: categoryId,
            },
          },
        },
        include: {
          category: true,
        },
      });
      return product;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(ProductModuleMessages.ConflictExceptionErrorMessage);
      }
      throw new BadRequestException(error.message);
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Product[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return this.prisma.product.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          category: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: id,
        },
        include: {
          category: true,
        },
      });

      if (product) return product;
      throw new BadRequestException(ProductModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(ProductModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateProductDto): Promise<Product> {
    try {
      const categoryExists = await this.prisma.category.findUnique({
        where: {
          id: updateProductDto.categoryId,
        },
        select: {
          id: true,
        },
      });

      if (!categoryExists) {
        throw new Error(ProductModuleMessages.ErrorMessage);
      }

      const updatedProduct = await this.prisma.product.update({
        where: {
          id: id,
        },
        data: {
          ...updateProductDto,
        },
      });
      return updatedProduct;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(ProductModuleMessages.BadRequestExceptionNotFoundErrorMessageForUpdate);
      }
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<Product> {
    try {
      const deleteProduct = await this.prisma.product.delete({
        where: {
          id: id,
        },
      });
      return deleteProduct;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(ProductModuleMessages.BadRequestExceptionNotFoundErrorMessageForDelete);
      }
      throw new BadRequestException(error.message);
    }
  }

  async productsFilteredByCategory(id: string, fromDate: string, toDate: string): Promise<Product[]> {
    try {
      const where = {
        categoryId: id,
      };

      if (fromDate && toDate) {
        Object.assign(where, {
          availableFrom: { lte: fromDate },
          availableTo: { gte: toDate },
        });
      }

      const product = await this.prisma.product.findMany({
        where,
        include: {
          category: true,
          likes: {
            include: {
              user: true,
              product: true,
            },
          },
        },
      });

      if (product) return product;
      throw new BadRequestException(ProductModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(ProductModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async likeProduct(userId: string, productId: string): Promise<Like> {
    try {
      await this.userService.findOne(userId);
      await this.findOne(productId);
      const alreadyExist = await this.prisma.like.findMany({
        where: {
          productId: productId,
        },
      });
      if (alreadyExist.length > 0)
        throw new BadRequestException(ProductModuleMessages.ConflictExceptionProductErrorMessage);
      const likedData = await this.prisma.like.create({
        data: {
          userId,
          productId,
        },
      });
      return likedData;
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(ProductModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async getProductsByUserLikes(userId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        likes: {
          some: {
            userId,
          },
        },
      },
    });

    return products;
  }

  async updateViewCounter(productId: string, counterBody): Promise<Product> {
    const { viewCounter } = counterBody;
    try {
      const updatedProduct = await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          viewCounter: viewCounter,
        },
      });

      return updatedProduct;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(ProductModuleMessages.BadRequestExceptionNotFoundErrorMessageForUpdate);
      }
      throw new BadRequestException(error.message);
    }
  }

  async searchProductsByLocation(placeId: string): Promise<Product[]> {
    try {
      const products = await this.prisma.product.findMany({});
      const filteredProducts = products.filter((pro) => pro.location.placeId === placeId);
      return filteredProducts;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
