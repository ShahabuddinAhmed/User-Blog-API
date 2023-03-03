import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString } from 'class-validator';

export class CommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is test comment',
  })
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @ApiProperty({
    description: 'The ID of the article that the comment is attached to',
    example: '64001d0e758e3372c2d83c84',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly article: string;
}
