import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class NodeMailerService {
  transporter: Transporter<SMTPTransport.SentMessageInfo>;
  config = {
    host: process.env.META_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.META_USER,
      pass: process.env.META_PASS,
    },
    logger: true,
  };
  email = process.env.META_USER;

  constructor() {
    this.transporter = createTransport(this.config);
  }

  async send(mail): Promise<SMTPTransport.SentMessageInfo> {
    return this.transporter.sendMail(mail);
  }
}
