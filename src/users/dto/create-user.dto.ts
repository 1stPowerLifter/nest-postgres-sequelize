import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  @ApiProperty({ example: 'Vasya', description: 'User first name' })
  readonly firstName: string;

  @IsString()
  @Length(2, 50)
  @ApiProperty({ example: 'Komar', description: 'User last name' })
  readonly lastName: string;

  @IsEmail()
  @ApiProperty({ example: 'vasya@mail.test', description: 'User email' })
  readonly email: string;

  @IsString()
  @Length(3, 20)
  @ApiProperty({ example: '1111', description: 'User password' })
  password?: string;

  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty({ example: '+380987654321', description: 'User phone number' })
  readonly phoneNumber?: string;

  @IsString()
  @IsOptional()
  @Length(1, 30)
  @ApiPropertyOptional()
  @ApiProperty({ example: 'USER', description: 'User role' })
  readonly role?: string;

  @IsString()
  @IsOptional()
  @Length(1, 30)
  readonly origin?: string;
}
