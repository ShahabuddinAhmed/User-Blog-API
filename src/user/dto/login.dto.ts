import { IsNotEmpty, Length, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'shahabuddin.cse.ru@gmail.com',
    description: 'The email of the User',
    format: 'email',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: '12345678',
    description: 'The password of the user',
    minLength: 8,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
