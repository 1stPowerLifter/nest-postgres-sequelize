import { Injectable } from '@nestjs/common';
import { CreateSmsDto } from 'src/sms/dto/create-sms.dto';
import { SmsService } from 'src/sms/sms.service';
import * as twilio from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export class SmsSendlerService {
  private readonly client: twilio.Twilio;

  constructor(private smsService: SmsService) {
    this.client = twilio(
      process.env.TWILIO_ACCPUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async send(dto: CreateSmsDto): Promise<MessageInstance> {
    const sms = await this.smsService.create(dto);
    const msg = await this.client.messages.create({
      to: dto.phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: dto.message,
    });
    await sms.update({ status: msg.status });
    return msg;
  }
}
