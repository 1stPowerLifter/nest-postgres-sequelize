import { Module } from '@nestjs/common';
import { SendGridService } from './send-grid.service';

@Module({
  providers: [SendGridService],
})
export class SendGridModule {}
