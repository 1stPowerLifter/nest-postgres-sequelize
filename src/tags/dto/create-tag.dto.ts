import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @Length(1, 50)
  @ApiProperty({ example: 'tag', description: 'Tag name' })
  readonly name: string;
}
