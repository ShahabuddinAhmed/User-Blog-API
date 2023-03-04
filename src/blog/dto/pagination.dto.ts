import { IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
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
}
