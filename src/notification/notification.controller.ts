import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';

import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { RolesGuard } from 'src/users/auth/roles.guard';
import { Role } from 'src/users/dto/role.enum';
import { ApiResponseTags } from 'src/utils/decorators/api-response-tags-decorator';

@Controller('notification')
@ApiTags('Notification Module')
@ApiResponseTags()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('getNotificationByUser/:id')
  @ApiParam({ name: 'id' })
  findNotificationsByUser(@Param('id') id: string) {
    return this.notificationService.findNotificationsByUser(id);
  }

  //Validate User based on Role
  // @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Post()
  createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Get()
  findAllNotification() {
    return this.notificationService.findAllNotification({});
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOneNotification(@Param('id') id: string) {
    return this.notificationService.findOneNotification(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  updateNotification(@Param('id') id: string, @Body() updateNotificationDto: CreateNotificationDto) {
    return this.notificationService.updateNotification(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  removeNotification(@Param('id') id: string) {
    return this.notificationService.removeNotification(id);
  }
}
