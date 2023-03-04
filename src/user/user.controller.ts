import { ListLikeSerializer } from './serializer/list-like.serializer';
import { HelperService } from './../helper/helper.service';
import { PaginationDto } from './../blog/dto/pagination.dto';
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
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
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

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly loggerService: LoggerService,
    private readonly helperService: HelperService,
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
      this.loggerService.error(errMessage, 'user.handler.register');
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
        'user.handler.login',
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
  @ApiBearerAuth()
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

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('like/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List user like' })
  @ApiCreatedResponse({})
  async listArticle(
    @Req() req,
    @Query() paginationDto: PaginationDto,
  ): Promise<ListLikeSerializer> {
    const { offset, limit } = await this.helperService.offsetLimitParser(
      paginationDto.offset,
      paginationDto.limit,
    );

    const { likes, count } = await this.userService.listLike(
      offset,
      limit,
      req.user,
    );

    return new ListLikeSerializer(
      HttpStatus.OK,
      'SUCCESS',
      'Like list',
      likes,
      [],
      { offset, limit, count },
    );
  }
}
