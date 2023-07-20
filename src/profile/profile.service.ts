import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';

import { Prisma, Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileModuleMessages } from 'src/utils/appMessges';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async createProfile(createProfileDto): Promise<Profile> {
    try {
      const profile = await this.prisma.profile.create({
        data: {
          ...createProfileDto,
        },
      });
      return profile;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(ProfileModuleMessages.ConflictExceptionErrorMessage);
      }
      throw new BadRequestException(error.message);
    }
  }

  async findAllProfile(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Profile[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return this.prisma.profile.findMany({
        skip,
        take,
        cursor,
        orderBy,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneProfile(id: string) {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: {
          id: id,
        },
        include: {
          user: true,
        },
      });

      if (profile) return profile;
      throw new BadRequestException(ProfileModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(ProfileModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateProfile(id: string, updateProfileDto) {
    try {
      const updatedProfile = await this.prisma.profile.update({
        where: {
          id: id,
        },
        data: {
          ...updateProfileDto,
        },
      });
      return updatedProfile;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(ProfileModuleMessages.BadRequestExceptionNotFoundErrorMessageForUpdate);
      }
      throw new BadRequestException(error.message);
    }
  }

  async removeProfile(id: string) {
    try {
      const deleteProfile = await this.prisma.profile.delete({
        where: {
          id: id,
        },
      });
      return deleteProfile;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(ProfileModuleMessages.BadRequestExceptionNotFoundErrorMessageForDelete);
      }
      throw new BadRequestException(error.message);
    }
  }
}
