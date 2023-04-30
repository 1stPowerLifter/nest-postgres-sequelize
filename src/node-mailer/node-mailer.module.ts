import { Module } from '@nestjs/common';
import { NodeMailerService } from './node-mailer.service';

@Module({
  providers: [NodeMailerService],
})
export class NodeMailerModule {}
