import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @Length(1, 30)
  @ApiProperty({ example: 'USER', description: 'User first name' })
  readonly role: string;
}
