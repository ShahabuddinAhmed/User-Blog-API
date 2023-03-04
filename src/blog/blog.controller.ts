import { ListCommentSerializer } from './serializer/list-comment.serializer';
import { ListCommentDto } from './dto/list-comment.dto';
import { DetailArticleDto } from './dto/detail-article.dto';
import { ListArticleSerializer } from './serializer/list-article.serializer';
import { PaginationDto } from './dto/pagination.dto';
import { SearchCategorySerializer } from './serializer/search-category.serializer';
import { HelperService } from './../helper/helper.service';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from './../user/guards/jwt-auth.guard';
import { CommentSerializer } from './serializer/comment.serializer';
import { CommentDto } from './dto/comment.dto';
import { CategorySerializer } from './serializer/category.serializer';
import { CreateCategoryDto } from './dto/create-category.dto';
import { LoggerService } from './../logger/logger.service';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
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
    private readonly helperService: HelperService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('category/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Category' })
  @ApiCreatedResponse({})
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategorySerializer> {
    const { category, errMessage } = await this.blogService.createCategory(
      createCategoryDto,
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
  @Patch('category/update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Category' })
  @ApiCreatedResponse({})
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategorySerializer> {
    const { category, errMessage } = await this.blogService.updateCategory(
      updateCategoryDto,
    );

    if (errMessage) {
      this.loggerService.error(errMessage, 'blog.handler.updateCategory');
      throw new BadRequestException(errMessage);
    }

    return new CategorySerializer(
      HttpStatus.CREATED,
      'SUCCESS',
      'Category successfully updated',
      category.toObject(),
      [],
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('category/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search Category' })
  @ApiCreatedResponse({})
  async searchCategory(
    @Query() searchCategoryDto: SearchCategoryDto,
  ): Promise<SearchCategorySerializer> {
    const { category, errMessage } = await this.blogService.searchCategory(
      searchCategoryDto.name,
    );

    if (errMessage) {
      this.loggerService.error(errMessage, 'blog.handler.searchCategory');
      throw new BadRequestException(errMessage);
    }

    return new SearchCategorySerializer(
      HttpStatus.OK,
      'SUCCESS',
      'Category List',
      category,
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
  @Get('article/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List article' })
  @ApiCreatedResponse({})
  async listArticle(
    @Query() paginationDto: PaginationDto,
  ): Promise<ListArticleSerializer> {
    const { offset, limit } = await this.helperService.offsetLimitParser(
      paginationDto.offset,
      paginationDto.limit,
    );

    const { articles, count, errMessage } = await this.blogService.listArticle(
      offset,
      limit,
    );

    if (errMessage) {
      this.loggerService.error(errMessage, 'blog.handler.listArticle');
      throw new BadRequestException(errMessage);
    }

    return new ListArticleSerializer(
      HttpStatus.OK,
      'SUCCESS',
      'Article list',
      articles,
      [],
      { offset, limit, count },
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('article/detail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Detail article' })
  @ApiCreatedResponse({})
  async detailArticle(
    @Query() detailArticleDto: DetailArticleDto,
  ): Promise<ArticleSerializer> {
    const { article, errMessage } = await this.blogService.detailArticle(
      detailArticleDto.article,
    );

    if (errMessage) {
      this.loggerService.error(errMessage, 'blog.handler.detailArticle');
      throw new BadRequestException(errMessage);
    }

    return new ArticleSerializer(
      HttpStatus.OK,
      'SUCCESS',
      'Detail article',
      article,
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
  @Get('article/listComment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List article' })
  @ApiCreatedResponse({})
  async listComment(
    @Query() listCommentDto: ListCommentDto,
  ): Promise<ListCommentSerializer> {
    const { offset, limit } = await this.helperService.offsetLimitParser(
      listCommentDto.offset,
      listCommentDto.limit,
    );

    const { comments, count } = await this.blogService.listComment(
      offset,
      limit,
      listCommentDto.article,
    );

    return new ListCommentSerializer(
      HttpStatus.OK,
      'SUCCESS',
      'List comment',
      comments,
      [],
      { offset, limit, count },
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
