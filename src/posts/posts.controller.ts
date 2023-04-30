import {
  Controller,
  UseGuards,
  Post,
  Body,
  Req,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { IRequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { Post as PostModel } from './post.model';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Posts')
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private postsServise: PostsService) {}

  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({ status: 200, type: PostModel })
  @Post()
  async create(
    @Body() dto: CreatePostDto,
    @Req() req: IRequestWithUser,
  ): Promise<PostModel> {
    return this.postsServise.create(dto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, type: [PostModel] })
  @Get()
  async getAll(): Promise<PostModel[]> {
    return this.postsServise.getAll();
  }

  @ApiOperation({ summary: 'Get all posts by category name' })
  @ApiResponse({ status: 200, type: [PostModel] })
  @Get(':category')
  async getAllByCategory(
    @Param('category') category: string,
  ): Promise<PostModel[]> {
    return this.postsServise.getAllByCategory(category);
  }

  @ApiOperation({ summary: 'Get all user posts by category name' })
  @ApiResponse({ status: 200, type: [PostModel] })
  @Get('my/:category')
  async getAllByUserCategory(
    @Param('category') category: string,
    @Req() req: IRequestWithUser,
  ): Promise<PostModel[]> {
    return this.postsServise.getAllByUserCategory(category, req.user.id);
  }

  @ApiOperation({ summary: 'Get all posts by id' })
  @ApiResponse({ status: 200, type: [PostModel] })
  @Get(':id')
  async getById(@Param('id') id: number): Promise<PostModel> {
    return this.postsServise.getById(id);
  }

  @ApiOperation({ summary: 'Get all posts by id' })
  @ApiResponse({ status: 200, type: [PostModel] })
  @Patch(':id')
  async updateById(
    @Body() dto: UpdatePostDto,
    @Param('id') id: number,
    @Req() req: IRequestWithUser,
  ): Promise<PostModel> {
    return this.postsServise.updateById(dto, req.user.id, id);
  }

  @ApiOperation({ summary: 'Get all posts by id' })
  @ApiResponse({ status: 200, type: [PostModel] })
  @Delete(':id')
  async removeById(
    @Param('id') id: number,
    @Req() req: IRequestWithUser,
  ): Promise<PostModel> {
    return this.postsServise.removeById(id, req.user.id);
  }
}
