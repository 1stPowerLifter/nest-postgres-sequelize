import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateMailDto {
  @IsEmail()
  @ApiProperty({
    example: 'vasya@mail.test',
    description: 'email to which the letter is sent',
  })
  readonly email: string;

  @IsString()
  @Length(0, 120)
  @ApiProperty({ example: 'nest.js', description: 'Subject of letter' })
  readonly subject: string;

  @IsString()
  @Length(0, 1000)
  @ApiProperty({ example: 'I like nest.js', description: 'Text of letter' })
  readonly text: string;

  @IsString()
  @Length(0, 1000)
  @ApiProperty({
    example: '<h1>Nest.js</h1>',
    description: 'Html code of letter',
  })
  readonly html: string;
}
