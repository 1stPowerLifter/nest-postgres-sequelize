import { Module, forwardRef } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './category.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from 'src/posts/post.model';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.model';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/role.model';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, UsersService, RolesService],
  imports: [
    SequelizeModule.forFeature([Category, Post, User, Role]),
    forwardRef(() => AuthModule),
  ],
})
export class CategoriesModule {}
