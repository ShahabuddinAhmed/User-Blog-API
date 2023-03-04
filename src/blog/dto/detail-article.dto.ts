import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DetailArticleDto {
  @ApiProperty({
    description: 'The ID of the article',
    example: '64001d0e758e3372c2d83c84',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly article: string;
}
