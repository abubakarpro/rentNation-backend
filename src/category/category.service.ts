import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';

import { Category, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryModuleMessages } from 'src/utils/appMessges';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = await this.prisma.category.create({
        data: {
          ...createCategoryDto,
        },
      });
      return category;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(CategoryModuleMessages.ConflictExceptionErrorMessage);
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
  }): Promise<Category[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return this.prisma.category.findMany({
        skip,
        take,
        cursor,
        orderBy,
        include: {
          products: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.category.findUnique({
        where: {
          id: id,
        },
      });

      if (user) return user;
      throw new BadRequestException(CategoryModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(CategoryModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateCategoryDto: CreateCategoryDto) {
    try {
      const updatedCategory = await this.prisma.category.update({
        where: {
          id: id,
        },
        data: {
          ...updateCategoryDto,
        },
      });
      return updatedCategory;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(CategoryModuleMessages.BadRequestExceptionNotFoundErrorMessageForUpdate);
      }
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const deleteCategory = await this.prisma.category.delete({
        where: {
          id: id,
        },
      });
      return deleteCategory;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(CategoryModuleMessages.BadRequestExceptionNotFoundErrorMessageForDelete);
      }
      throw new BadRequestException(error.message);
    }
  }
}
