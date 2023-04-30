import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { Mail } from './mail.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailsController } from './mails.controller';
import { MailsSendlerService } from 'src/mails-sendler/mails-sendler.service';
import { BullModule } from '@nestjs/bull';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';
import { SendGridService } from 'src/send-grid/send-grid.service';

@Module({
  providers: [
    MailsService,
    MailsSendlerService,
    NodeMailerService,
    SendGridService,
  ],
  imports: [
    SequelizeModule.forFeature([Mail]),
    BullModule.registerQueueAsync({
      name: 'mail',
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
          password: process.env.REDIS_PASSWORD,
        },
      }),
    }),
  ],
  controllers: [MailsController],
})
export class MailsModule {}
