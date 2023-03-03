import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class ArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'Shahabuddin',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The subtitle of the article',
    example: 'Ahmed',
  })
  @IsString()
  @IsNotEmpty()
  subTitle: string;

  @ApiProperty({
    description: 'The slug of the article',
    example: 'shahabuddin.cse.ru@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'The content of the article',
    example: 'Article content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The ID of the category to which the article belongs',
    example: '63ffa4f05f49d0c224516c96',
  })
  @IsMongoId()
  @IsNotEmpty()
  category: string;
}
