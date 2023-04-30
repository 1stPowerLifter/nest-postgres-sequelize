import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tag } from './tag.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag)
    private tagsRepository: typeof Tag,
  ) {}

  async create(dto: CreateTagDto): Promise<Tag> {
    if (await this.tagsRepository.findOne({ where: { name: dto.name } })) {
      throw new BadRequestException(
        `Tag with the name ${dto.name} already exists`,
      );
    }
    return this.tagsRepository.create(dto);
  }

  async createTags(dto: CreateTagDto[]): Promise<Tag[]> {
    return this.tagsRepository.bulkCreate(dto);
  }

  async getAll(): Promise<Tag[]> {
    return this.tagsRepository.findAll();
  }

  async getById(id: number): Promise<Tag> {
    const tag = await this.tagsRepository.findByPk(id);
    if (tag) return tag;
    throw new NotFoundException(`Tag with id ${id} not found`);
  }

  async getByNames(names: string[]): Promise<Tag[]> {
    return this.tagsRepository.findAll({
      where: {
        name: {
          [Op.in]: names,
        },
      },
    });
  }

  async removeById(id: number): Promise<Tag> {
    const tag = await this.tagsRepository.findByPk(id);
    if (tag) {
      await tag.$set('posts', []);
      await tag.destroy();
      return tag;
    }
    throw new NotFoundException(`Tag with id ${id} not found`);
  }
}
