import {
  IsOptional,
  IsNumberString,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListCommentDto {
  @ApiProperty({
    example: '0',
    description: 'offset of the article',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  readonly offset: number;

  @ApiProperty({
    example: '10',
    description: 'limit of the article',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  readonly limit: number;

  @ApiProperty({
    description: 'The ID of the article that the comment is attached to',
    example: '64001d0e758e3372c2d83c84',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly article: string;
}
