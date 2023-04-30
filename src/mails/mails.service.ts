import { Injectable, NotFoundException } from '@nestjs/common';
import { Mail } from './mail.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMailDto } from './dto/create-mail.dto';
import { Op } from 'sequelize';
import { MailsSendlerService } from 'src/mails-sendler/mails-sendler.service';
import { SendMailsDto } from './dto/send-mails.dto';

@Injectable()
export class MailsService {
  constructor(
    @InjectModel(Mail)
    private mailsRepository: typeof Mail,
    private mailsSendlerService: MailsSendlerService,
  ) {}

  async send(dto: CreateMailDto): Promise<Mail> {
    const { html, email, subject, text } = dto;
    await this.mailsSendlerService.send({
      to: email,
      html,
      subject,
      text,
    });
    return this.create(dto);
  }

  async sendMails(dto: SendMailsDto): Promise<Mail[]> {
    await this.mailsSendlerService.sendMails(dto.emails, dto.mail);
    const mails = dto.emails.map((email) => ({ ...dto.mail, email }));
    return this.createMails(mails);
  }

  async create(dto: CreateMailDto): Promise<Mail> {
    return this.mailsRepository.create(dto);
  }

  async createMails(dto: CreateMailDto[]): Promise<Mail[]> {
    return this.mailsRepository.bulkCreate(dto);
  }

  async getAll(): Promise<Mail[]> {
    return this.mailsRepository.findAll();
  }

  async getOneById(id: number): Promise<Mail> {
    const mail = await this.mailsRepository.findOne({ where: { id } });
    if (mail) return mail;
    throw new NotFoundException(`Mail with id:${id} not found`);
  }

  async getOneByEmail(email: string): Promise<Mail> {
    const mail = await this.mailsRepository.findOne({ where: { email } });
    if (mail) return mail;
    throw new NotFoundException(`Mail with email:${email} not found`);
  }

  async getOneBySomeText(text: string): Promise<Mail> {
    const mail = await this.mailsRepository.findOne({
      where: {
        text: {
          [Op.like]: `%${text}%`,
        },
      },
    });

    if (mail) return mail;
    throw new NotFoundException(`Mail with text:"${text}" not found`);
  }

  async removeById(id: number): Promise<Mail> {
    const mail = await this.getOneById(id);
    await mail.destroy();
    return mail;
  }

  async removeByEmail(email: string): Promise<Mail> {
    const mail = await this.getOneByEmail(email);
    await mail.destroy();
    return mail;
  }
}
