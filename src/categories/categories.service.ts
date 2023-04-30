import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from './category.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Post } from 'src/posts/post.model';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private categoryRepository: typeof Category,
  ) {}

  async getAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async getOneById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findByPk(id, {
      include: { model: Post },
    });
    if (category) return category;
    throw new NotFoundException(`Category with id ${id} not found`);
  }

  async getOneByName(name: string): Promise<Category> {
    return this.categoryRepository.findOne({ where: { name } });
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    if (dto.name === 'null') {
      throw new BadRequestException('Null cannot be a category name');
    }
    const category = await this.categoryRepository.findOne({
      where: { name: dto.name },
    });
    if (!category) return this.categoryRepository.create(dto);
    throw new BadRequestException(
      `Category with the name ${dto.name} already exists`,
    );
  }

  async updateById(dto: UpdateCategoryDto, id: number): Promise<string> {
    if (dto.name) {
      const category = await this.categoryRepository.findOne({
        where: { name: dto.name },
      });
      if (category && category.id !== id) {
        throw new BadRequestException(
          `Category with the name ${dto.name} already exists`,
        );
      }
    }
    const category = await this.categoryRepository.update(dto, {
      where: { id },
    });
    if (category) return `Category with id ${id} update`;
    throw new NotFoundException(`Category with id ${id} not found`);
  }

  async removeById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findByPk(id);
    if (category) {
      await category.$set('posts', []);
      await category.destroy();
      return category;
    }
    throw new NotFoundException(`Category with id ${id} not found`);
  }
}
