import { JwtAuthGuard } from './../user/guards/jwt-auth.guard';
import { CommentSerializer } from './serializer/comment.serializer';
import { CommentDto } from './dto/comment.dto';
import { CategorySerializer } from './serializer/category.serializer';
import { CategoryDto } from './dto/category.dto';
import { LoggerService } from './../logger/logger.service';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleDto } from './dto/article.dto';
import { ArticleSerializer } from './serializer/article.serializer';
import { LikeDto } from './dto/like.dto';
import { LikeSerializer } from './serializer/like.serializer';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly loggerService: LoggerService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('category/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Category' })
  @ApiCreatedResponse({})
  async createCategory(
    @Body() categoryDto: CategoryDto,
  ): Promise<CategorySerializer> {
    const { category, errMessage } = await this.blogService.createCategory(
      categoryDto,
    );

    if (errMessage) {
      this.loggerService.error(errMessage, 'blog.handler.createCategory');
      throw new BadRequestException(errMessage);
    }

    return new CategorySerializer(
      HttpStatus.CREATED,
      'SUCCESS',
      'Category successfully created',
      category.toObject(),
      [],
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('article/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create article' })
  @ApiCreatedResponse({})
  async createArticle(
    @Req() req,
    @Body() articleDto: ArticleDto,
  ): Promise<ArticleSerializer> {
    const { article, errMessage } = await this.blogService.createArticle(
      articleDto,
      req.user,
    );

    if (errMessage) {
      this.loggerService.error(errMessage, 'blog.handler.createArticle');
      throw new BadRequestException(errMessage);
    }

    return new ArticleSerializer(
      HttpStatus.CREATED,
      'SUCCESS',
      'Article successfully created',
      article.toObject(),
      [],
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('article/leaveComment')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create article' })
  @ApiCreatedResponse({})
  async leaveComment(
    @Req() req,
    @Body() commentDto: CommentDto,
  ): Promise<CommentSerializer> {
    const { comment, errMessage } = await this.blogService.leaveComment(
      commentDto,
      req.user,
    );

    if (errMessage) {
      this.loggerService.error(errMessage, 'blog.handler.leaveComment');
      throw new BadRequestException(errMessage);
    }

    return new CommentSerializer(
      HttpStatus.CREATED,
      'SUCCESS',
      'Comment successfully created',
      comment.toObject(),
      [],
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('article/addLike')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create article' })
  @ApiCreatedResponse({})
  async addLike(@Req() req, @Body() likeDto: LikeDto): Promise<LikeSerializer> {
    const { like, errMessage } = await this.blogService.addLike(
      likeDto,
      req.user,
    );

    if (errMessage) {
      this.loggerService.error(errMessage, 'blog.handler.addLike');
      throw new BadRequestException(errMessage);
    }

    return new LikeSerializer(
      HttpStatus.CREATED,
      'SUCCESS',
      'Like successfully created',
      like.toObject(),
      [],
    );
  }
}
