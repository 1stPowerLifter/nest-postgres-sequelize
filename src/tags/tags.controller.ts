import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TagsService } from './tags.service';
import { Tag } from './tag.model';
import { CreateTagDto } from './dto/create-tag.dto';

@ApiTags('Tags')
@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @ApiOperation({ summary: 'Create tag' })
  @ApiResponse({ status: 200, type: Tag })
  @Post()
  async create(@Body() dto: CreateTagDto): Promise<Tag> {
    return this.tagsService.create(dto);
  }

  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, type: [Tag] })
  @Get()
  async getAll(): Promise<Tag[]> {
    return this.tagsService.getAll();
  }

  @ApiOperation({ summary: 'Get tag by id' })
  @ApiResponse({ status: 200, type: Tag })
  @Get(':id')
  async getById(@Param('id') id: number): Promise<Tag> {
    return this.tagsService.getById(id);
  }

  @ApiOperation({ summary: 'Remove tag by id' })
  @ApiResponse({ status: 200, type: Tag })
  @Delete(':id')
  async removeById(@Param('id') id: number): Promise<Tag> {
    return this.tagsService.removeById(id);
  }
}
