import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsMongoId } from 'class-validator';

export class LikeDto {
  @ApiProperty({
    description:
      'A boolean value indicating whether the user likes the article',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  readonly isLike: boolean;

  @ApiProperty({
    description: 'The ID of the article being liked',
    example: '63ffa5005f49d0c224516c9a',
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly article: string;
}
