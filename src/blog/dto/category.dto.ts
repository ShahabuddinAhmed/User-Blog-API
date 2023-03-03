import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Food',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The slug for the category URL',
    example: 'food',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
