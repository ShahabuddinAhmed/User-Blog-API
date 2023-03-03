import { UpdateUserSerializer } from './serializer/update-user.serializer';
import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  HttpStatus,
  HttpCode,
  Req,
  Ip,
  Body,
  BadRequestException,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoggerService } from '../logger/logger.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginSerializer } from './serializer/login.serializer';
import { RegisterSerializer } from './serializer/register.serializer';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly loggerService: LoggerService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register User' })
  @ApiCreatedResponse({})
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterSerializer> {
    const { user, errMessage } = await this.userService.register(registerDto);
    if (errMessage) {
      this.loggerService.error(errMessage, 'auth.handler.register');
      throw new BadRequestException(errMessage);
    }

    return new RegisterSerializer(
      HttpStatus.CREATED,
      'SUCCESS',
      'Register Successful',
      user,
      [],
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login User' })
  @ApiOkResponse({})
  async login(
    @Req() req: Request,
    @Ip() ip: string,
    @Body() loginDto: LoginDto,
  ): Promise<LoginSerializer> {
    const { user, accessToken, errMessage } = await this.userService.login(
      req,
      ip,
      loginDto,
    );

    if (errMessage) {
      this.loggerService.error(
        JSON.stringify(errMessage),
        'auth.handler.login',
      );
      throw new BadRequestException(errMessage);
    }
    return new LoginSerializer(
      HttpStatus.OK,
      'SUCCESS',
      'Login Successful',
      user,
      [],
      { accessToken },
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update User' })
  @ApiOkResponse({})
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserSerializer> {
    const user = await this.userService.update(req.user, updateUserDto);
    return new UpdateUserSerializer(
      HttpStatus.OK,
      'SUCCESS',
      'User successfully updated',
      user.toObject(),
      [],
    );
  }
}
