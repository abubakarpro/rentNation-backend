import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';

import { Cart, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CartModuleMessages } from 'src/utils/appMessges';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async createCart(createCartDto: CreateCartDto): Promise<Cart> {
    const { userId, quantity, subTotal, totalPrice, productId } = createCartDto;
    try {
      const cartData = await this.prisma.cart.create({
        data: {
          userId: userId,
          quantity: quantity,
          subTotal: subTotal,
          totalPrice: totalPrice,
          CartProduct: {
            create: productId.map((id) => ({
              product: { connect: { id: id } },
            })),
          },
        },
        include: {
          CartProduct: {
            include: {
              product: true,
            },
          },
        },
      });
      return cartData;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllCart(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Cart[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return this.prisma.cart.findMany({
        skip,
        take,
        cursor,
        orderBy,
        include: {
          CartProduct: {
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

  async findOneCart(id: string): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: {
          id: id,
        },
        include: {
          CartProduct: {
            include: {
              product: true,
            },
          },
        },
      });

      if (cart) return cart;
      throw new BadRequestException(CartModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(CartModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateCart(id: string, updateCartDto): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: {
          id: id,
        },
      });

      if (cart) {
        const deleteCartProduct = await this.prisma.cartProduct.deleteMany({
          where: {
            cartId: id,
          },
        });

        const createPromisesForProductCreation = updateCartDto.productId.map((productId) =>
          this.prisma.cartProduct.create({
            data: {
              productId,
              cartId: id,
            },
          }),
        );

        await Promise.all(createPromisesForProductCreation);
      }

      const updatedCart = await this.prisma.cart.update({
        where: {
          id: id,
        },
        data: {
          userId: updateCartDto.userId,
          quantity: updateCartDto.quantity,
          subTotal: updateCartDto.subTotal,
          totalPrice: updateCartDto.totalPrice,
        },
        include: {
          CartProduct: {
            include: {
              product: true,
            },
          },
        },
      });
      return updatedCart;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(CartModuleMessages.BadRequestExceptionNotFoundErrorMessageForUpdate);
      }
      throw new BadRequestException(error.message);
    }
  }

  async removeCart(id: string): Promise<Cart> {
    try {
      const deleteCategory = await this.prisma.cart.delete({
        where: {
          id: id,
        },
      });
      return deleteCategory;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(CartModuleMessages.BadRequestExceptionNotFoundErrorMessageForDelete);
      }
      throw new BadRequestException(error.message);
    }
  }
}
