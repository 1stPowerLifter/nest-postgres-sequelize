import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { Tag } from './tag.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.model';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/role.model';

@Module({
  controllers: [TagsController],
  providers: [TagsService, JwtService, UsersService, RolesService],
  imports: [SequelizeModule.forFeature([Tag, User, Role])],
})
export class TagsModule {}
