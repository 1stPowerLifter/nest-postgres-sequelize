import { InjectQueue } from '@nestjs/bull';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientResponse } from '@sendgrid/mail';
import { Queue } from 'bull';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';
import { SendGridService } from 'src/send-grid/send-grid.service';
import { IMail } from './interface/mail.interface';

@Injectable()
export class MailsSendlerService {
  private client: NodeMailerService | SendGridService;
  constructor(
    @InjectQueue('mail') private queue: Queue,
    private nodeMailerService: NodeMailerService,
    private sendGridService: SendGridService,
  ) {
    switch (process.env.MAILS_SENDLER_SERVICE) {
      case process.env.NODEMAILER:
        this.client = this.sendGridService;
        break;
      case process.env.SENDGID:
        this.client = this.nodeMailerService;
        break;
      default:
        throw new InternalServerErrorException('Mailer is not selected');
    }
  }

  async send(
    mail: IMail,
  ): Promise<SMTPTransport.SentMessageInfo | [ClientResponse, object]> {
    mail.from = this.client.email;
    return this.client.send(mail);
  }

  async sendMails(emails: string[], mail: IMail): Promise<void> {
    const queueMails = emails.map((email) => ({
      data: {
        ...mail,
        to: email,
      },
      opts: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }));
    await this.queue.addBulk(queueMails);
  }
}
