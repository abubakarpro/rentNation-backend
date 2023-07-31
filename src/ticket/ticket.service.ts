import { Injectable, BadRequestException } from '@nestjs/common';

import { Ticket, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketModuleMessages } from '../utils/appMessges';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket> {
    try {
      const ticket = await this.prisma.ticket.create({
        data: {
          ...createTicketDto,
        },
      });
      return ticket;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllTickets(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Ticket[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.ticket.findMany({
        skip,
        take,
        cursor,
        orderBy,
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneTicket(id: string) {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: {
          id: id,
        },
      });

      if (ticket) return ticket;
      throw new BadRequestException(TicketModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(TicketModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateTicket(id: string, updateTicketDto: CreateTicketDto) {
    try {
      const updatedTicket = await this.prisma.ticket.update({
        where: {
          id: id,
        },
        data: {
          ...updateTicketDto,
        },
      });
      return updatedTicket;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(TicketModuleMessages.BadRequestExceptionNotFoundErrorMessageForUpdate);
      }
      throw new BadRequestException(error.message);
    }
  }

  async removeTicket(id: string) {
    try {
      const deleteTicket = await this.prisma.ticket.delete({
        where: {
          id: id,
        },
      });
      return deleteTicket;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(TicketModuleMessages.BadRequestExceptionNotFoundErrorMessageForDelete);
      }
      throw new BadRequestException(error.message);
    }
  }

  async getAllTicketsByUser(userId: string) {
    try {
      const tickets = await this.prisma.ticket.findMany({
        where: {
          userId: userId,
        },
        include: {
          user: true,
        },
      });

      if (tickets) return tickets;
      throw new BadRequestException(TicketModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(TicketModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }
}
