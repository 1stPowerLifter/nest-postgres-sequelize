import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from './post.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePostDto } from './dto/create-post.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { TagsService } from 'src/tags/tags.service';
import { Category } from 'src/categories/category.model';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post)
    private postsRepository: typeof Post,
    private categoriesService: CategoriesService,
    private tagsService: TagsService,
  ) {}

  async create(dto: CreatePostDto, userId: number): Promise<Post> {
    const { title, content, category, tags } = dto;
    await this.errorIfNotNewPost(title, userId);
    const post = new Post({ title, content });
    post.userId = userId;
    if (category) post.categoryId = await this.assignCategory(category);
    await post.save();
    if (tags && tags.length > 0) {
      return this.addTagsAndReturnPost(tags, post);
    }
    return post;
  }

  async getAll(): Promise<Post[]> {
    return this.postsRepository.findAll();
  }

  async getUserAll(userId: number): Promise<Post[]> {
    return this.postsRepository.findAll({ where: { userId } });
  }

  async getAllByCategory(categoryName: string): Promise<Post[]> {
    let category: { id?: string } | Category;
    categoryName !== 'null'
      ? (category = await this.categoriesService.getOneByName(categoryName))
      : (category.id = null);
    if (category) {
      return this.postsRepository.findAll({
        where: { categoryId: category.id },
      });
    }
    throw new BadRequestException(`The category "${category}" does not exist`);
  }

  async getAllByUserCategory(
    categoryName: string,
    userId: number,
  ): Promise<Post[]> {
    let category: { id?: string } | Category;
    categoryName !== 'null'
      ? (category = await this.categoriesService.getOneByName(categoryName))
      : (category.id = null);
    if (category) {
      return this.postsRepository.findAll({
        where: { categoryId: category.id, userId },
      });
    }
    throw new BadRequestException(`The category "${category}" does not exist`);
  }

  async getById(id: number): Promise<Post> {
    const post = await this.postsRepository.findByPk(id);
    if (post) return post;
    throw new NotFoundException(`Post with id ${id} not found`);
  }

  async updateById(
    dto: UpdatePostDto,
    userId: number,
    id: number,
  ): Promise<Post> {
    const { title, content, category, tags } = dto;
    let post = await this.getOneByIdAndUserId(id, userId);
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.categoryId = await this.assignCategory(category);
    if (tags) post = await this.addTagsAndReturnPost(tags, post);
    await post.save();
    return post;
  }

  async removeById(id: number, userId: number): Promise<Post> {
    const post = await this.getOneByIdAndUserId(id, userId);
    if (!post) {
      throw new BadRequestException(`You don't have a post with id ${id}`);
    }
    await post.$set('tags', []);
    await post.destroy();
    return post;
  }

  private async errorIfNotNewPost(
    title: string,
    userId: number,
  ): Promise<void> {
    if (
      await this.postsRepository.findOne({
        where: { title, userId },
      })
    ) {
      throw new BadRequestException(
        `A post with the title ${title} already exists`,
      );
    }
  }

  private async getOneByIdAndUserId(id: number, userId: number): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { userId, id } });
    if (post) return post;
    throw new BadRequestException(`You don't have a post with id ${id}`);
  }

  private async assignCategory(categoryName: string): Promise<number> {
    const category = await this.categoriesService.getOneByName(categoryName);
    if (category) return category.id;
    throw new NotFoundException(`${categoryName} category not found`);
  }

  private async addTagsAndReturnPost(
    tags: [string],
    post: Post,
  ): Promise<Post> {
    const existingTags = await this.tagsService.getByNames(tags);
    const arrForFilter = existingTags.map((tag) => tag.dataValues.name);
    const newTagsNames = tags
      .filter((tag) => !arrForFilter.includes(tag))
      .map((tag) => ({ name: tag }));
    const newTags = await this.tagsService.createTags(newTagsNames);
    await post.$add('tags', [...existingTags, ...newTags]);
    return post;
  }
}
