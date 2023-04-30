import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsObject,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class MailDto {
  @IsString()
  @Length(0, 120)
  readonly subject: string;

  @IsString()
  @Length(0, 1000)
  readonly text: string;

  @IsString()
  @Length(0, 1000)
  readonly html: string;
}

export class SendMailsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  @ApiProperty({
    example: ['vasya@mail.test', 'kolya@mail.com'],
    description: 'email to which the letter is sent',
  })
  readonly emails: string[];

  @IsObject()
  @ApiProperty({
    example: {
      subject: 'Subject',
      text: 'text',
      html: 'html',
    },
    description: 'Letter',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => MailDto)
  mail: MailDto;
}
