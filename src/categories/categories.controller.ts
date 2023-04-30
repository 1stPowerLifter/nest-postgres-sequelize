import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { Category } from './category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private categoriesServise: CategoriesService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, type: [Category] })
  @Get()
  async getAll(): Promise<Category[]> {
    return this.categoriesServise.getAll();
  }

  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, type: Category })
  @Get()
  async getOneById(@Param('id') id: number): Promise<Category> {
    return this.categoriesServise.getOneById(id);
  }

  @ApiOperation({ summary: 'Create new category' })
  @ApiResponse({ status: 200, type: Category })
  @Post()
  async create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoriesServise.create(dto);
  }

  async updateById(
    @Body() dto: UpdateCategoryDto,
    @Param('id') id: number,
  ): Promise<string> {
    return this.categoriesServise.updateById(dto, id);
  }

  @ApiOperation({ summary: 'Remove category by id' })
  @ApiResponse({ status: 200, type: Category })
  @Delete(':id')
  async removeById(@Param('id') id: number): Promise<Category> {
    return this.categoriesServise.removeById(id);
  }
}
