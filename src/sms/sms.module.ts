import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { Sms } from './sms.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  providers: [SmsService],
  imports: [SequelizeModule.forFeature([Sms])],
  exports: [SmsService],
})
export class SmsModule {}
