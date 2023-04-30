import { Module } from '@nestjs/common';
import { PostTag } from './post-tag.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([PostTag])],
})
export class PostTagsModule {}
