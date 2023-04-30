import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsPhoneNumber()
  @ApiProperty({ example: '+380987654321', description: 'User phone number' })
  readonly phoneNumber: string;

  @IsString()
  @Length(6)
  @ApiProperty({ example: '000000', description: 'User phone number' })
  readonly OTP: string;
}
