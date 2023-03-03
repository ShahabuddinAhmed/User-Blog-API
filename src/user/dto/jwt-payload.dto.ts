import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JwtPayloadDto {
  @ApiProperty({
    example: '6048cfa44f738e221c0011a1',
    description: 'The unique identifier for the user',
  })
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '192.168.0.1',
    description: 'The IP address used to create the user account',
  })
  ip: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299',
    description: 'The user agent string used to create the user account',
  })
  userAgent: string;
}
