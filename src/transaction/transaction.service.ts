import { Injectable, BadRequestException } from '@nestjs/common';

import { Transaction, Prisma } from '@prisma/client';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionModuleMessages } from '../utils/appMessges';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createTranscation(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    try {
      const transaction = await this.prisma.transaction.create({
        data: {
          ...createTransactionDto,
        },
      });
      return transaction;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllTransactions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Transaction[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.transaction.findMany({
        skip,
        take,
        cursor,
        orderBy,
        include: {
          user: true,
          order: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneTransaction(id: string) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: {
          id: id,
        },
      });

      if (transaction) return transaction;
      throw new BadRequestException(TransactionModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(TransactionModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateTransaction(id: string, updateTransactionDto: CreateTransactionDto) {
    try {
      const updatedTransaction = await this.prisma.transaction.update({
        where: {
          id: id,
        },
        data: {
          ...updateTransactionDto,
        },
      });
      return updatedTransaction;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(TransactionModuleMessages.BadRequestExceptionNotFoundErrorMessageForUpdate);
      }
      throw new BadRequestException(error.message);
    }
  }

  async removeTransaction(id: string) {
    try {
      const deleteTransaction = await this.prisma.transaction.delete({
        where: {
          id: id,
        },
      });
      return deleteTransaction;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(TransactionModuleMessages.BadRequestExceptionNotFoundErrorMessageForDelete);
      }
      throw new BadRequestException(error.message);
    }
  }
}
