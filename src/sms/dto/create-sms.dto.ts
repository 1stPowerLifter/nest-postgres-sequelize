import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateSmsDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @Length(0, 500)
  message: string;
}
