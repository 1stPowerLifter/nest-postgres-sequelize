import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(2, 50)
  @IsOptional()
  @ApiPropertyOptional()
  @ApiProperty({ example: 'Vasya', description: 'User first name' })
  readonly firstName: string;

  @IsString()
  @Length(2, 50)
  @IsOptional()
  @ApiPropertyOptional()
  @ApiProperty({ example: 'Komar', description: 'User last name' })
  readonly lastName: string;

  @IsString()
  @Length(1, 30)
  @IsOptional()
  @ApiPropertyOptional()
  @ApiProperty({ example: 'USER', description: 'User role' })
  readonly role?: string;
}
