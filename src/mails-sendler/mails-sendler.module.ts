import { Module } from '@nestjs/common';
import { MailsSendlerService } from './mails-sendler.service';
import { SendGridModule } from 'src/send-grid/send-grid.module';
import { NodeMailerModule } from 'src/node-mailer/node-mailer.module';
import { BullModule } from '@nestjs/bull';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';
import { SendGridService } from 'src/send-grid/send-grid.service';
import { MailProcessor } from './mails-sendler.processor';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'mail',
      useFactory: () => ({
        redis: {
          host: 'redis-12043.c293.eu-central-1-1.ec2.cloud.redislabs.com',
          port: 12043,
          password: 'v3vFJ4458MhNNS2iNwqH0ESTQhoJUgpJ',
        },
      }),
    }),
    NodeMailerModule,
    SendGridModule,
  ],
  providers: [
    MailsSendlerService,
    NodeMailerService,
    SendGridService,
    MailProcessor,
  ],
})
export class MailsSendlerModule {}

// imports: [

//   NodeMailerModule,
//   SendGridModule.forRoot({
//     apiKey: 'SENDGRID_API_KEY',
//   }),
// ],
// providers: [MailsSendlerService, BullQueue_mail],
// exports: [MailsSendlerService],
