import { Body, Controller, Post } from '@nestjs/common';
import { MailsService } from './mails.service';
import { Mail } from './mail.model';
import { CreateMailDto } from './dto/create-mail.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendMailsDto } from './dto/send-mails.dto';

@Controller('mails')
export class MailsController {
  constructor(private mailsServise: MailsService) {}

  @ApiOperation({ summary: 'Send mail' })
  @ApiResponse({ status: 200, type: Mail })
  @Post()
  async send(@Body() dto: CreateMailDto): Promise<Mail> {
    return this.mailsServise.send(dto);
  }

  @ApiOperation({ summary: 'Send mails' })
  @ApiResponse({ status: 200, type: [Mail] })
  @Post('q')
  async sendMails(@Body() dto: SendMailsDto): Promise<Mail[]> {
    return this.mailsServise.sendMails(dto);
  }
}
