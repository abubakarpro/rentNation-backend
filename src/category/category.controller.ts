import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { RolesGuard } from 'src/users/auth/roles.guard';
import { Role } from 'src/users/dto/role.enum';
import { ApiResponseTags } from 'src/utils/decorators/api-response-tags-decorator';

@Controller('category')
@ApiTags('Category Module')
@ApiResponseTags()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //Validate User based on Role
  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  findAllCategories() {
    return this.categoryService.findAllCategories({});
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOneCategory(@Param('id') id: string) {
    return this.categoryService.findOneCategory(id);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Put(':id')
  @ApiParam({ name: 'id' })
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: CreateCategoryDto) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Delete(':id')
  @ApiParam({ name: 'id' })
  removeCategory(@Param('id') id: string) {
    return this.categoryService.removeCategory(id);
  }
}
