import { ElasticSearchService } from './../elastic-search/elastic-search.service';
import { MessageQueueService } from './../message-queue/message-queue.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import esb from 'elastic-builder';
import { Model, Types } from 'mongoose';
import { CategoryDocument } from './schemas/category.schema';
import { ArticleDocument } from './schemas/article.schema';
import { LikeDocument } from './schemas/like.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { LikeDto } from './dto/like.dto';
import { JwtPayloadDto } from 'src/user/dto/jwt-payload.dto';
import { ArticleDto } from './dto/article.dto';
import { CommentDto } from './dto/comment.dto';
import { CommentDocument } from './schemas/comment.schema';
import { EventPatternType } from 'src/utils/utils.enum';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<CategoryDocument>,
    @InjectModel('Article') private articleModel: Model<ArticleDocument>,
    @InjectModel('Like') private likeModel: Model<LikeDocument>,
    @InjectModel('Comment') private commentModel: Model<CommentDocument>,
    private readonly messageQueueService: MessageQueueService,
    private readonly elasticSearchService: ElasticSearchService,
  ) {}

  public async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ category: CategoryDocument | null; errMessage: string }> {
    const checkCategory = await this.getCategory({
      name: createCategoryDto.name,
      slug: createCategoryDto.slug,
    });
    if (checkCategory) {
      return {
        category: null,
        errMessage: 'This category already exist',
      };
    }

    const createdCategory = await this.categoryModel.create(createCategoryDto);
    await this.messageQueueService.publish(
      EventPatternType.CREATED_CATEGORY,
      createdCategory,
    );

    return {
      category: createdCategory,
      errMessage: '',
    };
  }

  public async updateCategory(
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ category: CategoryDocument | null; errMessage: string }> {
    const checkCategory = await this.getCategory({
      name: updateCategoryDto.name,
      slug: updateCategoryDto.slug,
    });
    if (checkCategory) {
      return {
        category: null,
        errMessage: 'This category already exist',
      };
    }

    const updatedCategory = await this.categoryModel.findOneAndUpdate(
      { _id: updateCategoryDto.categoryId },
      updateCategoryDto,
      { new: true },
    );

    await this.messageQueueService.publish(
      EventPatternType.UPDATED_CATEGORY,
      updatedCategory,
    );

    return {
      category: updatedCategory,
      errMessage: '',
    };
  }

  public async searchCategory(
    name = '',
  ): Promise<{ category: CategoryDocument[]; errMessage: string }> {
    const query = esb
      .requestBodySearch()
      .query(
        esb
          .boolQuery()
          .filter(
            esb.boolQuery().should(esb.matchPhrasePrefixQuery('name', name)),
          ),
      );

    const { body } =
      await this.elasticSearchService.elasticsearchService.search({
        index: process.env.INDICES,
        body: query,
      });

    if (!body.hits.hits.length) {
      return {
        category: [],
        errMessage: '',
      };
    }
    const category = body.hits.hits.map((source) => {
      return source._source;
    });

    return {
      category,
      errMessage: '',
    };
  }

  public async createArticle(
    articleDto: ArticleDto,
    jwtPayloadDto: JwtPayloadDto,
  ): Promise<{ article: ArticleDocument | null; errMessage: string }> {
    const checkCategory = await this.getCategory({
      _id: articleDto.category,
    });
    if (!checkCategory) {
      return { article: null, errMessage: 'Please provide a valid categoryId' };
    }

    return {
      article: await this.articleModel.create({
        ...articleDto,
        user: jwtPayloadDto.userId,
      }),
      errMessage: '',
    };
  }

  public async listArticle(
    offset: number,
    limit: number,
  ): Promise<{
    articles: ArticleDocument[];
    count: number;
    errMessage: string;
  }> {
    return {
      articles: await this.articleModel
        .find({}, ['title', 'subTitle', 'slug', 'category'])
        .skip(offset)
        .limit(limit)
        .lean(),
      count: await this.articleModel.count(),
      errMessage: '',
    };
  }

  public async detailArticle(articleId: string): Promise<{
    article: ArticleDocument | null;
    errMessage: string;
  }> {
    const checkArticle = await this.articleModel
      .findById({ _id: articleId })
      .lean();

    if (!checkArticle) {
      return {
        article: null,
        errMessage: 'Please provide valid articleId',
      };
    }
    return {
      article: checkArticle,
      errMessage: '',
    };
  }

  public async leaveComment(
    commentDto: CommentDto,
    jwtPayloadDto: JwtPayloadDto,
  ): Promise<{ comment: CommentDocument | null; errMessage: string }> {
    const checkArticle = await this.getArticleById(commentDto.article);
    if (!checkArticle) {
      return { comment: null, errMessage: 'Please provide a valid articleId' };
    }

    const checkExistingComment = await this.getCommentByArticleId(
      commentDto.article,
    );
    if (!checkExistingComment) {
      const parent = new Types.ObjectId();

      return {
        comment: await this.commentModel.create({
          _id: parent,
          ...commentDto,
          parent,
          user: jwtPayloadDto.userId,
        }),
        errMessage: '',
      };
    }

    return {
      comment: await this.commentModel.create({
        ...commentDto,
        parent: checkExistingComment._id,
        user: jwtPayloadDto.userId,
      }),
      errMessage: '',
    };
  }

  public async listComment(
    offset: number,
    limit: number,
    article: string,
  ): Promise<{
    comments: CommentDocument[];
    count: number;
  }> {
    return {
      comments: await this.commentModel
        .find({ article })
        .populate('user', ['firstName', 'lastName'])
        .skip(offset)
        .limit(limit)
        .lean(),
      count: await this.commentModel.count({ article }),
    };
  }

  private async getCommentByArticleId(
    article: string,
  ): Promise<CommentDocument | null> {
    return this.commentModel.findOne({ article });
  }

  public async addLike(
    likeDto: LikeDto,
    jwtPayloadDto: JwtPayloadDto,
  ): Promise<{ like: LikeDocument | null; errMessage: string }> {
    const checkArticle = await this.getArticleById(likeDto.article);
    if (!checkArticle) {
      return { like: null, errMessage: 'Please provide a valid articleId' };
    }

    return {
      like: await this.likeModel.findOneAndUpdate(
        {
          user: jwtPayloadDto.userId,
          article: likeDto.article,
        },
        {
          ...likeDto,
          user: jwtPayloadDto.userId,
        },
        { upsert: true, new: true },
      ),
      errMessage: '',
    };
  }

  private async getArticleById(
    articleId: string,
  ): Promise<ArticleDocument | null> {
    return this.articleModel.findById({ _id: articleId });
  }

  private async getCategory(query: object): Promise<CategoryDocument | null> {
    return this.categoryModel.findOne(query);
  }
}
