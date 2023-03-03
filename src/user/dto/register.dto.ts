import {
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Shahabuddin Ahmed',
    description: 'The name of the user',
    minLength: 2,
    maxLength: 100,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  readonly firstName: string;

  @ApiProperty({
    example: 'Shahabuddin Ahmed',
    description: 'The name of the user',
    minLength: 2,
    maxLength: 100,
    required: true,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  readonly lastName: string;

  @ApiProperty({
    example: 'shahabuddin.cse.ru@gmail.com',
    description: 'The email of the User',
    format: 'email',
    maxLength: 100,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: '12345678',
    description: 'The password of the user with at least 8 characters',
    minLength: 8,
    maxLength: 100,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 100)
  readonly password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '01701042597',
    description: 'The mobile phone number of the user',
    required: false,
  })
  readonly mobile: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Mohakhali, Dhaka',
    description: 'The address of the user',
    required: false,
  })
  readonly address: string;
}
