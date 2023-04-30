import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './post.model';
import { CategoriesService } from 'src/categories/categories.service';
import { TagsService } from 'src/tags/tags.service';
import { Category } from 'src/categories/category.model';
import { Tag } from 'src/tags/tag.model';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.model';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/role.model';

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    CategoriesService,
    TagsService,
    JwtService,
    UsersService,
    RolesService,
  ],
  imports: [SequelizeModule.forFeature([Post, Category, Tag, User, Role])],
})
export class PostsModule {}
