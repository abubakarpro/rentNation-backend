import { Injectable, BadRequestException } from '@nestjs/common';

import { Order, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { OrderModuleMessages } from 'src/utils/appMessges';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto): Promise<Order> {
    const { userId, subTotal, totalPrice, productData, status } = createOrderDto;
    try {
      if (productData.length === 0) {
        throw new BadRequestException(OrderModuleMessages.BadRequestExceptionProductErrorMessage);
      }

      const orderData = await this.prisma.order.create({
        data: {
          userId: userId,
          status: status,
          subTotal: subTotal,
          totalPrice: totalPrice,
          productData: productData,
          OrderProduct: {
            create: productData.map((product) => ({
              product: { connect: { id: product.id } },
            })),
          },
        },
        include: {
          OrderProduct: {
            include: {
              product: true,
            },
          },
        },
      });
      return orderData;
    } catch (error) {
      console.log('eeeee', error);
      if (error.code === 'P2025') {
        throw new BadRequestException(OrderModuleMessages.BadRequestExceptionNotFoundErrorMessage);
      }
      throw new BadRequestException(error.message);
    }
  }

  async findAllOrder(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Order[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return this.prisma.order.findMany({
        skip,
        take,
        cursor,
        orderBy,
        include: {
          OrderProduct: {
            include: {
              product: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneOrder(id: string): Promise<Order> {
    try {
      const order = await this.prisma.order.findUnique({
        where: {
          id: id,
        },
        include: {
          OrderProduct: {
            include: {
              product: true,
            },
          },
        },
      });

      if (order) return order;
      throw new BadRequestException(OrderModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(OrderModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateOrder(id: string, updateOrderDto): Promise<Order> {
    try {
      const order = await this.prisma.order.findUnique({
        where: {
          id: id,
        },
      });

      if (order) {
        const deleteOrderProduct = await this.prisma.orderProduct.deleteMany({
          where: {
            orderId: id,
          },
        });

        const createPromisesForProductCreation = updateOrderDto.productData.map((product) =>
          this.prisma.orderProduct.create({
            data: {
              productId: product.id,
              orderId: id,
            },
          }),
        );
        await Promise.all(createPromisesForProductCreation);
      }

      const updatedOrder = await this.prisma.order.update({
        where: {
          id: id,
        },
        data: {
          userId: updateOrderDto.userId,
          subTotal: updateOrderDto.subTotal,
          productData: updateOrderDto.productData,
          totalPrice: updateOrderDto.totalPrice,
        },
        include: {
          OrderProduct: {
            include: {
              product: true,
            },
          },
        },
      });
      return updatedOrder;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(OrderModuleMessages.BadRequestExceptionNotFoundErrorMessageForUpdate);
      }
      throw new BadRequestException(error.message);
    }
  }

  async removeOrder(id: string): Promise<Order> {
    try {
      const deleteCategory = await this.prisma.order.delete({
        where: {
          id: id,
        },
      });
      return deleteCategory;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(OrderModuleMessages.BadRequestExceptionNotFoundErrorMessageForDelete);
      }
      throw new BadRequestException(error.message);
    }
  }
}
