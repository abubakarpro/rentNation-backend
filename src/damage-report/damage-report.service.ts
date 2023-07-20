import { Injectable, BadRequestException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { DamageReport, Prisma } from '@prisma/client';
import { CreateDamageReportDto } from './dto/create-damageReport.dto';
import { DamageReportModuleMessages } from '../utils/appMessges';

@Injectable()
export class DamageReportService {
  constructor(private prisma: PrismaService) {}

  async createDamageReport(createDamageReportDto: CreateDamageReportDto): Promise<DamageReport> {
    try {
      const damageReport = await this.prisma.damageReport.create({
        data: {
          ...createDamageReportDto,
        },
      });
      return damageReport;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllDamageReport(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<DamageReport[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return this.prisma.damageReport.findMany({
        skip,
        take,
        cursor,
        orderBy,
        include: {
          product: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneDamageReport(id: string) {
    try {
      const damageReport = await this.prisma.damageReport.findUnique({
        where: {
          id: id,
        },
        include: {
          product: true,
        },
      });

      if (damageReport) return damageReport;
      throw new BadRequestException(DamageReportModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(DamageReportModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateDamageReport(id: string, updateDamageReportDto: CreateDamageReportDto) {
    try {
      const updatedDamageReport = await this.prisma.damageReport.update({
        where: {
          id: id,
        },
        data: {
          ...updateDamageReportDto,
        },
        include: {
          product: true,
        },
      });
      return updatedDamageReport;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(DamageReportModuleMessages.BadRequestExceptionNotFoundErrorMessageForUpdate);
      }
      throw new BadRequestException(error.message);
    }
  }

  async removeDamageReport(id: string) {
    try {
      const deleteDamageReport = await this.prisma.damageReport.delete({
        where: {
          id: id,
        },
      });
      return deleteDamageReport;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(DamageReportModuleMessages.BadRequestExceptionNotFoundErrorMessageForDelete);
      }
      throw new BadRequestException(error.message);
    }
  }

  async findDamageReportByProduct(productId: string): Promise<DamageReport> {
    try {
      const damageReportByProduct = await this.prisma.damageReport.findUnique({
        where: {
          productId: productId,
        },
        include: {
          product: true,
        },
      });

      if (damageReportByProduct) return damageReportByProduct;
      throw new BadRequestException(DamageReportModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(DamageReportModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }
}
