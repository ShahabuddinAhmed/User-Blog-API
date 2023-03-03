import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsMongoId,
} from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'The ID of the category to which the article belongs',
    example: '63ffa4f05f49d0c224516c96',
  })
  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'The name of the category',
    example: 'Food',
  })
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty({
    description: 'The slug for the category URL',
    example: 'food',
  })
  @IsString()
  @IsOptional()
  readonly slug: string;

  @ApiProperty({
    description: 'The article list is this category',
    example: ['12', '13'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly articles: string[];
}
