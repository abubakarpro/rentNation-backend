import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../users/auth/roles.guard';
import { Role } from '../users/dto/role.enum';
import { CreateProfileDto } from '../profile/dto/create-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.createProfile(createProfileDto);
  }

  @Get()
  findAllProfile() {
    return this.profileService.findAllProfile({});
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOneProfile(@Param('id') id: string) {
    return this.profileService.findOneProfile(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  updateProfile(@Param('id') id: string, @Body() updateProfileDto: CreateProfileDto) {
    return this.profileService.updateProfile(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  removeProfile(@Param('id') id: string) {
    return this.profileService.removeProfile(id);
  }
}
