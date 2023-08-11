import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';

import { DamageReportService } from './damage-report.service';
import { CreateDamageReportDto } from './dto/create-damageReport.dto';
import { RolesGuard } from '../users/auth/roles.guard';
import { Role } from '../users/dto/role.enum';
import { ApiResponseTags } from 'src/utils/decorators/api-response-tags-decorator';

@Controller('damageReport')
@ApiTags('Damage Report Module')
@ApiResponseTags()
export class DamageReportController {
  constructor(private readonly damageReportService: DamageReportService) {}

  @Get('getDamageReportByProduct/:id')
  @ApiParam({ name: 'id' })
  findDamageReportByProduct(@Param('id') id: string) {
    return this.damageReportService.findDamageReportByProduct(id);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Post()
  createDamageReport(@Body() createDamageReportDto: CreateDamageReportDto) {
    return this.damageReportService.createDamageReport(createDamageReportDto);
  }

  @Get()
  findAllDamageReport() {
    return this.damageReportService.findAllDamageReport({});
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOneDamageReport(@Param('id') id: string) {
    return this.damageReportService.findOneDamageReport(id);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Put(':id')
  @ApiParam({ name: 'id' })
  updateDamageReport(@Param('id') id: string, @Body() updateDamageReportDto: CreateDamageReportDto) {
    return this.damageReportService.updateDamageReport(id, updateDamageReportDto);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Delete(':id')
  @ApiParam({ name: 'id' })
  removeDamageReport(@Param('id') id: string) {
    return this.damageReportService.removeDamageReport(id);
  }
}
