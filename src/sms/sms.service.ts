import { Injectable } from '@nestjs/common';
import { Sms } from './sms.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateSmsDto } from './dto/create-sms.dto';

@Injectable()
export class SmsService {
  constructor(@InjectModel(Sms) private smsRepository: typeof Sms) {}

  async create(dto: CreateSmsDto): Promise<Sms> {
    return this.smsRepository.create(dto);
  }

  async changeStatusById(
    status: string,
    id: number,
  ): Promise<[affectedCount: number]> {
    return this.smsRepository.update({ status }, { where: { id } });
  }
}
