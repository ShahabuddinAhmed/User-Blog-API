import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Shahabuddin',
    description: 'The updated first name of the user',
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Ahmed',
    description: 'The updated last name of the user',
  })
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '01701042597',
    description: 'The updated mobile number of the user',
  })
  mobile?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Mohakhali, Dhaka',
    description: 'The updated address of the user',
  })
  address?: string;
}
