import { Module } from '@nestjs/common';
import { SmsSendlerService } from './sms-sendler.service';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  providers: [SmsSendlerService],
  imports: [SmsModule],
  exports: [SmsSendlerService],
})
export class SmsSendlerModule {}
