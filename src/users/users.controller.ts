import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { ResetPasswordUserDTO } from './dto/resetPassword.dto';
import { IUserResponse } from './dto/interface-user';
import { OAuthUserDTO } from './dto/OAuthUserDTO.dto';
import { RolesGuard } from '../users/auth/roles.guard';
import { Role } from '../users/dto/role.enum';
import { CreateUserAndProfileDTO } from './dto/update-user-profile.dto';

@Controller('users')
@ApiTags('USER Module')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('updateUserAndProfile/:id')
  @ApiParam({ name: 'id' })
  updateUserAndProfile(@Param('id') id: string, @Body() updatedUserAndProdileData: CreateUserAndProfileDTO) {
    return this.usersService.updateUserAndProfile(id, updatedUserAndProdileData);
  }

  @Post('login')
  handleUserLogin(@Body() userlogin: LoginUserDTO): Promise<IUserResponse> {
    return this.usersService.handleUserLogin(userlogin);
  }

  @Post('resetPassword/:id')
  @ApiParam({ name: 'id' })
  handleResetPassword(@Param('id') id: string, @Body() resetPasswordReq: ResetPasswordUserDTO): Promise<IUserResponse> {
    return this.usersService.handleResetPassword(id, resetPasswordReq);
  }

  @Post('googleLogin')
  handleGoogleLogin(@Body() loginGoogleUserReq: OAuthUserDTO): Promise<IUserResponse> {
    return this.usersService.handleGoogleUserLogin(loginGoogleUserReq);
  }

  @Post('facebookLogin')
  handleFacebookLogin(@Body() loginFacebookUserReq: OAuthUserDTO): Promise<IUserResponse> {
    return this.usersService.handleFacebookUserLogin(loginFacebookUserReq);
  }

  @Post('appleLogin')
  handleAppleLogin(@Body() loginAppleUserReq: OAuthUserDTO): Promise<IUserResponse> {
    return this.usersService.handleAppleLogin(loginAppleUserReq);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Post('createSubAdmin')
  handleCreateSubAdmin(@Body() userData: CreateUserDTO): Promise<IUserResponse> {
    return this.usersService.handleCreateSubAdmin(userData);
  }

  @Post()
  create(@Body() userData: CreateUserDTO): Promise<IUserResponse> {
    return this.usersService.create(userData);
  }

  @Get()
  findAll(): Promise<UserModel[]> {
    return this.usersService.findAll({});
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Put(':id')
  @ApiParam({ name: 'id' })
  update(@Param('id') id: string, @Body() updatedUserData: CreateUserDTO) {
    return this.usersService.update(id, updatedUserData);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
