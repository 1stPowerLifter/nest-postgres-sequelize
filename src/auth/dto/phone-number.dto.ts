import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class PhoneNumberDto {
  @IsPhoneNumber()
  @ApiProperty({ example: '+380987654321', description: 'User phone number' })
  readonly phoneNumber: string;
}
