import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { RolesGuard } from 'src/users/auth/roles.guard';
import { Role } from 'src/users/dto/role.enum';

@Controller('category')
@ApiTags('Category Module')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //Validate User based on Role
  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll({});
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.USER))
  @Put(':id')
  @ApiParam({ name: 'id' })
  update(@Param('id') id: string, @Body() updateCategoryDto: CreateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
