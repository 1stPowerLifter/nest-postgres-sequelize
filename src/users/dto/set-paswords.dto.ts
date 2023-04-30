import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class SetPaswordsDto {
  @IsString()
  @Length(3, 20)
  @ApiProperty({ example: '2222', description: 'New password' })
  readonly newPassword: string;

  @IsString()
  @Length(3, 20)
  @ApiProperty({ example: '2222', description: 'Repeat new password' })
  readonly repeatNewPassword: string;

  @IsString()
  @Length(3, 20)
  @ApiProperty({ example: '1111', description: 'Old password' })
  readonly oldPassword: string;
}
