import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchCategoryDto {
  @ApiProperty({
    example: 'Rice',
    description: 'name of the category',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
