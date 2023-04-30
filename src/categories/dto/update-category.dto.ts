import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @Length(2, 25)
  @ApiPropertyOptional({ example: 'category', description: 'Category name' })
  readonly name: string;

  @IsString()
  @Length(0, 255)
  @ApiPropertyOptional({
    example: 'The best category',
    description: 'Category description',
  })
  readonly description: string;
}
