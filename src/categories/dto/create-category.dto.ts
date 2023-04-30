import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(2, 25)
  @ApiProperty({ example: 'category', description: 'Category name' })
  readonly name: string;

  @IsString()
  @Length(0, 255)
  @ApiProperty({
    example: 'The best category',
    description: 'Category description',
  })
  readonly description: string;
}
