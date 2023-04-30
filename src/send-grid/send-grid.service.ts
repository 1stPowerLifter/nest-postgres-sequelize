import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  transporter: sgMail.MailService;
  email = process.env.SENDGRID_MAIL;

  constructor() {
    this.transporter = sgMail;
    this.transporter.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async send(mail): Promise<[sgMail.ClientResponse, object]> {
    return this.transporter.send(mail);
  }
}
