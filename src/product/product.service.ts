import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Product, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

const ConflictExceptionErrorMessage = 'Product already exist';
const BadRequestExceptionInvalid = 'Invalid request';
const BadRequestExceptionNotFoundErrorMessageForUpdate =
  'Record to update does not exist';
const BadRequestExceptionNotFoundErrorMessageForDelete =
  'Record to delete does not exist';
const BadRequestExceptionNotFoundErrorMessage = 'Entity with ID not found';
const ErrorMessage = 'Category not found';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto): Promise<Product> {
    try {
      const { 
        name, categoryId, quantity, pricePerDay, description, 
        properties, location, discountPerWeek, availableFrom, availableTo, images } = createProductDto;
      const categoryExists = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
        select: {
          id: true,
        },
      });

      if (!categoryExists) {
        throw new Error(ErrorMessage);
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
          images:images,
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
        throw new ConflictException(ConflictExceptionErrorMessage);
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
      throw new BadRequestException(BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: string,
    updateProductDto,
  ): Promise<Product> {
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
        throw new Error(ErrorMessage);
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
        throw new BadRequestException(
          BadRequestExceptionNotFoundErrorMessageForUpdate,
        );
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
        throw new BadRequestException(
          BadRequestExceptionNotFoundErrorMessageForDelete,
        );
      }
      throw new BadRequestException(error.message);
    }
  }
}
