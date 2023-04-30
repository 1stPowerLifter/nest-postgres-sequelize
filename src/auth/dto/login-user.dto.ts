import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({ example: 'vasya@mail.test', description: 'User email' })
  readonly email: string;

  @IsString()
  @Length(3, 20)
  @ApiProperty({ example: '1111', description: 'User password' })
  readonly password: string;
}
