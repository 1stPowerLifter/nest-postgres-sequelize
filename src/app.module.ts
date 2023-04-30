import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { MailsModule } from './mails/mails.module';
import { PostTagsModule } from './post-tags/post-tags.module';
import { PostsModule } from './posts/posts.module';
import { RolesModule } from './roles/roles.module';
import { SmsModule } from './sms/sms.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { SmsSendlerModule } from './sms-sendler/sms-sendler.module';
import { RedisModule } from './redis/redis.module';
import { User } from './users/user.model';
import { Role } from './roles/role.model';
import { Post } from './posts/post.model';
import { Category } from './categories/category.model';
import { Tag } from './tags/tag.model';
import { PostTag } from './post-tags/post-tag.model';
import { Mail } from './mails/mail.model';
import { Sms } from './sms/sms.model';
import { NodeMailerModule } from './node-mailer/node-mailer.module';
import { SendGridModule } from './send-grid/send-grid.module';
import { MailsSendlerModule } from './mails-sendler/mails-sendler.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASS,
      database: process.env.POSTGRES_NAME,
      models: [User, Role, Post, Category, Tag, PostTag, Mail, Sms],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    CategoriesModule,
    MailsModule,
    PostTagsModule,
    PostsModule,
    RolesModule,
    SmsModule,
    TagsModule,
    AuthModule,
    SmsSendlerModule,
    RedisModule,
    NodeMailerModule,
    SendGridModule,
    MailsSendlerModule,
  ],
})
export class AppModule {}
