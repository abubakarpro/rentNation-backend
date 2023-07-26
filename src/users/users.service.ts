import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User, Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { IUserResponse } from './dto/interface-user';
import { ResetPasswordUserDTO } from './dto/resetPassword.dto';
import { OAuthUserDTO } from './dto/OAuthUserDTO.dto';
import { CreateUserAndProfileDTO } from './dto/update-user-profile.dto';
import { UserModuleMessages } from 'src/utils/appMessges';

const prismaClient = new PrismaClient();

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
      throw new UnauthorizedException(UserModuleMessages.UnauthorizedExceptionErrorMessage);
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

      if (!user) {
        throw new NotFoundException(UserModuleMessages.NotFoundExceptionErrorMessage);
      }

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (passwordMatches) {
        const payload: { email: string } = {
          email,
        };
        const accessToken: string = this.jwtService.sign(payload);

        const userWithoutPassword = Object.assign({}, user);
        delete userWithoutPassword.password;

        return {
          user: userWithoutPassword,
          accessToken: accessToken,
        };
      }
      throw new UnauthorizedException(UserModuleMessages.UnauthorizedExceptionErrorMessage);
    } catch (error) {
      if (error.message === UserModuleMessages.UnauthorizedExceptionErrorMessage) {
        throw new UnauthorizedException(UserModuleMessages.UnauthorizedExceptionErrorMessage);
      }
      throw new BadRequestException(error.message);
    }
  }

  async createUser(userCreateReq: CreateUserDTO): Promise<IUserResponse> {
    try {
      if (userCreateReq.role === 'SUB_ADMIN' || userCreateReq.role === 'ADMIN') {
        throw new ForbiddenException(UserModuleMessages.ForbiddenExceptionErrorMessage);
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(userCreateReq.password, salt);

      const payload = { email: userCreateReq.email };
      const accessToken: string = this.jwtService.sign(payload);

      const user = await this.prisma.user.create({
        data: {
          ...userCreateReq,
          password: hashedPassword,
        },
      });

      const userWithoutPassword = Object.assign({}, user);
      delete userWithoutPassword.password;

      return {
        user: userWithoutPassword,
        accessToken: accessToken,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(UserModuleMessages.ConflictExceptionErrorMessage);
      }
      throw new BadRequestException(error.message);
    }
  }

  async findAllUser(params: {
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
        include: {
          profile: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneUser(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        include: {
          profile: true,
        },
      });

      if (user) {
        return user;
      }
      throw new BadRequestException(UserModuleMessages.BadRequestExceptionNotFoundErrorMessage);
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException(UserModuleMessages.BadRequestExceptionInvalid);
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateUser(id: string, data: CreateUserDTO): Promise<User> {
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

      const userWithoutPassword = Object.assign({}, updatedUser);
      delete userWithoutPassword.password;

      return userWithoutPassword;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(UserModuleMessages.BadRequestExceptionNotFoundErrorMessageForUpdate);
      }
      throw new BadRequestException(error.message);
    }
  }

  async removeUser(id: string): Promise<User> {
    try {
      const deleteCustomer = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      return deleteCustomer;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(UserModuleMessages.BadRequestExceptionNotFoundErrorMessageForDelete);
      }
      throw new BadRequestException(error.message);
    }
  }

  async handleResetPassword(id: string, resetPasswordReq: ResetPasswordUserDTO): Promise<any> {
    try {
      const user = await this.findOneUser(id);
      if (!user) throw new BadRequestException(UserModuleMessages.UserNotExist);
      if (user && (await bcrypt.compare(resetPasswordReq.oldPassword, user.password))) {
        const salt = await bcrypt.genSalt();
        const hashedPassword: string = await bcrypt.hash(resetPasswordReq.newPassword, salt);
        const updatedUser = await this.prisma.user.update({
          where: {
            id: id,
          },
          data: {
            password: hashedPassword,
          },
        });
        return updatedUser;
      }
      throw new BadRequestException(UserModuleMessages.BadRequestExceptionPasswordMessage);
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
      if (user && user.googleUser) {
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
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(UserModuleMessages.ConflictExceptionErrorMessage);
      }
      throw new BadRequestException(error.message);
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
      if (user && user.facebookUser) {
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
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(UserModuleMessages.ConflictExceptionErrorMessage);
      }
      throw new BadRequestException(error.message);
    }
  }

  //AppleUser
  async handleAppleLogin(data: OAuthUserDTO): Promise<IUserResponse> {
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
      if (user && user.appleUser) {
        return {
          user: user,
          accessToken: accessToken,
        };
      } else {
        const userReg = await this.prisma.user.create({
          data: {
            email: data.email,
            name: data.name,
            appleUser: true,
            password: '',
            role: 'USER',
          },
        });
        return {
          user: userReg,
          accessToken: accessToken,
        };
      }
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(UserModuleMessages.ConflictExceptionErrorMessage);
      }
      throw new BadRequestException(error.message);
    }
  }

  async handleCreateSubAdmin(userCreateReq: CreateUserDTO): Promise<IUserResponse> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(userCreateReq.password, salt);

      const payload = { email: userCreateReq.email };
      const accessToken: string = this.jwtService.sign(payload);

      const user = await this.prisma.user.create({
        data: {
          ...userCreateReq,
          password: hashedPassword,
        },
      });

      const userWithoutPassword = Object.assign({}, user);
      delete userWithoutPassword.password;

      return {
        user: userWithoutPassword,
        accessToken: accessToken,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(UserModuleMessages.ConflictExceptionErrorMessage);
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateUserAndProfile(id: string, updatedUserAndProdileData: CreateUserAndProfileDTO) {
    const { name, bio, email } = updatedUserAndProdileData;
    try {
      const updatedUserAndProfile = await prismaClient.$transaction([
        prismaClient.user.update({
          where: { id: id },
          data: {
            name: name,
            email: email,
          },
        }),
        prismaClient.profile.update({
          where: { userId: id },
          data: {
            bio: bio,
          },
        }),
      ]);

      return updatedUserAndProfile;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(UserModuleMessages.ConflictExceptionErrorMessage);
      }
      throw new BadRequestException(error.message);
    }
  }
}
