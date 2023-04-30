import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @Length(1, 120)
  @ApiPropertyOptional({ example: 'Title', description: 'Post title' })
  readonly title: string;

  @IsString()
  @Length(0, 2000)
  @ApiPropertyOptional({
    example: 'The best post content',
    description: 'Post content',
  })
  readonly content: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  @ApiPropertyOptional({
    example: 'category',
    description: 'The name of the post category',
  })
  readonly category?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    example: ['tag1', 'tag2'],
    description: 'The tags of the post',
  })
  readonly tags?: [string];
}
