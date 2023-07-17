import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { IUserResponse } from './dto/interface-user';
import { ResetPasswordUserDTO } from './dto/resetPassword.dto';
import { OAuthUserDTO } from './dto/OAuthUserDTO.dto';

const UnauthorizedExceptionErrorMessage = 'Please check you login credentials';
const BadRequestExceptionNotFoundErrorMessageForUpdate =
  'Record to update does not exist';
const BadRequestExceptionNotFoundErrorMessageForDelete =
  'Record to delete does not exist';
const ConflictExceptionErrorMessage = 'User already exist';
const BadRequestExceptionInvalid = 'Invalid request';
const BadRequestExceptionNotFoundErrorMessage = 'Entity with ID not found';
const BadRequestExceptionPasswordMessage = 'Old password is not correct!';
const ForbiddenExceptionErrorMessage = "You don't have permission to create account for SUB-ADMIN or ADMIN";


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(email: string) {
    const user: any = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException(UnauthorizedExceptionErrorMessage);
    }
  }

  async handleUserLogin(userCredentials: LoginUserDTO): Promise<IUserResponse> {
    const { email, password } = userCredentials;
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (user && (await bcrypt.compare(password, user.password))) {
        const payload: { email: string } = {
          email,
        };
        const accessToken: string = this.jwtService.sign(payload);

        return {
          user: user,
          accessToken: accessToken,
        };
      }
      throw new UnauthorizedException(UnauthorizedExceptionErrorMessage);
    } catch (error) {
      if (error.message === UnauthorizedExceptionErrorMessage) {
        throw new UnauthorizedException(UnauthorizedExceptionErrorMessage);
      }
      throw new BadRequestException(error.message);
    }
  }

  async create(userCreateReq: CreateUserDTO): Promise<IUserResponse> {
    try {
      if(userCreateReq.role === "SUB_ADMIN" || userCreateReq.role === "ADMIN") {
        throw new ForbiddenException(ForbiddenExceptionErrorMessage);
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(
        userCreateReq.password,
        salt,
      );

      const payload = { email: userCreateReq.email };
      const accessToken: string = this.jwtService.sign(payload);

      const user = await this.prisma.user.create({
        data: {
          ...userCreateReq,
          password: hashedPassword,
        },
      });

      return {
        user: user,
        accessToken: accessToken,
      };
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
  }): Promise<User[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (user) return user;
      throw new BadRequestException(BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, data: CreateUserDTO): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(data.password, salt);

      const updatedUser = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          ...data,
          password: hashedPassword,
        },
      });
      return updatedUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(
          BadRequestExceptionNotFoundErrorMessageForUpdate,
        );
      }
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const deleteCustomer = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      return deleteCustomer;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(
          BadRequestExceptionNotFoundErrorMessageForDelete,
        );
      }
      throw new BadRequestException(error.message);
    }
  }

  async handleResetPassword(
    id: string,
    resetPasswordReq: ResetPasswordUserDTO,
  ): Promise<any> {
    try {
      const user = await this.findOne(id);
      if (!user) throw new BadRequestException('User Not exist');
      if (
        user &&
        (await bcrypt.compare(resetPasswordReq.oldPassword, user.password))
      ) {
        const salt = await bcrypt.genSalt();
        const hashedPassword: string = await bcrypt.hash(
          resetPasswordReq.newPassword,
          salt,
        );
        delete user.id;
        const updatedUser = await this.prisma.user.update({
          where: {
            id: id,
          },
          data: {
            ...user,
            password: hashedPassword,
          },
        });
        return updatedUser;
      }
      throw new BadRequestException(BadRequestExceptionPasswordMessage);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //GoogleUser
  async handleGoogleUserLogin(data: OAuthUserDTO): Promise<IUserResponse> {
    const { name, email } = data;
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });

      const payload: { email: string } = {
        email: email,
      };
      const accessToken: string = this.jwtService.sign(payload);
      if (user) {
        return {
          user: user,
          accessToken: accessToken,
        };
      } else {
        const userReg = await this.prisma.user.create({
          data: {
            email: data.email,
            name: data.name,
            googleUser: true,
            password: '',
            role: 'USER',
          },
        });
        return {
          user: userReg,
          accessToken: accessToken,
        };
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  //FacebookUser
  async handleFacebookUserLogin(data: OAuthUserDTO): Promise<IUserResponse> {
    const { name, email } = data;
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });

      const payload: { email: string } = {
        email: email,
      };
      const accessToken: string = this.jwtService.sign(payload);
      if (user) {
        return {
          user: user,
          accessToken: accessToken,
        };
      } else {
        const userReg = await this.prisma.user.create({
          data: {
            email: data.email,
            name: data.name,
            facebookUser: true,
            password: '',
            role: 'USER',
          },
        });
        return {
          user: userReg,
          accessToken: accessToken,
        };
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async handleCreateSubAdmin(userCreateReq: CreateUserDTO): Promise<IUserResponse> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(
        userCreateReq.password,
        salt,
      );

      const payload = { email: userCreateReq.email };
      const accessToken: string = this.jwtService.sign(payload);

      const user = await this.prisma.user.create({
        data: {
          ...userCreateReq,
          password: hashedPassword,
        },
      });

      return {
        user: user,
        accessToken: accessToken,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(ConflictExceptionErrorMessage);
      }
      throw new BadRequestException(error.message);
    }
  }
}
