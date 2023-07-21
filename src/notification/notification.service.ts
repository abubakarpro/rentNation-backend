import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';

import { Notification, Prisma } from '@prisma/client';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationModuleMessages } from '../utils/appMessges';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(createCategoryDto: CreateNotificationDto): Promise<Notification> {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          ...createCategoryDto,
        },
      });
      return notification;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllNotification(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Notification[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return this.prisma.notification.findMany({
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

  async findOneNotification(id: string): Promise<Notification> {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: {
          id: id,
        },
        include: {
          user: true,
        },
      });

      if (notification) return notification;
      throw new BadRequestException(NotificationModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(NotificationModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateNotification(id: string, updateNotificationDto: CreateNotificationDto): Promise<Notification> {
    try {
      const updatedNotification = await this.prisma.notification.update({
        where: {
          id: id,
        },
        data: {
          ...updateNotificationDto,
        },
      });
      return updatedNotification;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(NotificationModuleMessages.BadRequestExceptionNotFoundErrorMessageForUpdate);
      }
      throw new BadRequestException(error.message);
    }
  }

  async removeNotification(id: string): Promise<Notification> {
    try {
      const deleteNotification = await this.prisma.notification.delete({
        where: {
          id: id,
        },
      });
      return deleteNotification;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(NotificationModuleMessages.BadRequestExceptionNotFoundErrorMessageForDelete);
      }
      throw new BadRequestException(error.message);
    }
  }

  async findNotificationsByUser(userId: string): Promise<Notification[]> {
    try {
      const notificationByProduct = await this.prisma.notification.findMany({
        where: {
          userId: userId,
        },
        include: {
          user: true,
        },
      });

      if (notificationByProduct) return notificationByProduct;
      throw new BadRequestException(NotificationModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(NotificationModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }
}
