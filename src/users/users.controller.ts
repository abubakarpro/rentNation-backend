import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { ResetPasswordUserDTO } from './dto/resetPassword.dto';
import { IUserResponse } from './dto/interface-user';
import { OAuthUserDTO } from './dto/OAuthUserDTO.dto';
import { RolesGuard } from 'src/users/auth/roles.guard';
import { Role } from 'src/users/dto/role.enum';

@Controller('users')
@ApiTags('USER Module')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  handleUserLogin(@Body() userlogin: LoginUserDTO): Promise<IUserResponse> {
    return this.usersService.handleUserLogin(userlogin);
  }

  @Post('resetPassword/:id')
  @ApiParam({ name: 'id' })
  handleResetPassword(@Param('id') id: string, @Body() resetPasswordReq: ResetPasswordUserDTO): Promise<IUserResponse> {
    return this.usersService.handleResetPassword(id,resetPasswordReq);
  }

  @Post('googleLogin')
  handleGoogleLogin(@Body() loginGoogleUserReq: OAuthUserDTO): Promise<IUserResponse> {
    return this.usersService.handleGoogleUserLogin(loginGoogleUserReq)
  }

  @Post('facebookLogin')
  handleFacebookLogin(@Body() loginFacebookUserReq: OAuthUserDTO): Promise<IUserResponse> {
    return this.usersService.handleFacebookUserLogin(loginFacebookUserReq)
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.USER))
  @Post("createSubAdmin")
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
