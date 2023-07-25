import { Injectable, BadRequestException } from '@nestjs/common';

import { Order, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { OrderModuleMessages } from 'src/utils/appMessges';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService, private readonly ProductService: ProductService) {}

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
      if (orderData) {
        productData?.map(async (product) => {
          const getOriginalProduct = await this.ProductService.findOne(product.id);
          const getOriginalProductAvailability = getOriginalProduct.availability;
          const getOriginalProductQuantity = getOriginalProduct.quantity;

          const productDataAvailability = productData.find((item) => item.id === product.id)?.availability || [];
          const productDataQuantity = productData.find((item) => item.id === product.id)?.quantity || 0;
          const commonDates = getOriginalProductAvailability.filter((date) => !productDataAvailability.includes(date));
          const newAvailability = commonDates;
          const newQuantity = getOriginalProductQuantity - productDataQuantity;

          const updatedProductData = {
            availability: newAvailability,
            quantity: newQuantity,
          };
          await this.ProductService.updateProductBasedOnOrder(getOriginalProduct.id, updatedProductData);
        });
      }
      return orderData;
    } catch (error) {
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
