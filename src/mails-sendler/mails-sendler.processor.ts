import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailsSendlerService } from './mails-sendler.service';
import { IMail } from './interface/mail.interface';

@Processor('mail')
export class MailProcessor {
  constructor(private readonly mailsSendlerService: MailsSendlerService) {}

  @Process()
  async sendMail(job: Job<IMail>): Promise<void> {
    try {
      await this.mailsSendlerService.send(job.data);
    } catch (error) {
      throw error;
    }
  }
}
