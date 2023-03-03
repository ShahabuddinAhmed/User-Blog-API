import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Article, ArticleDocument } from './schemas/article.schema';
import { Like, LikeDocument } from './schemas/like.schema';
import { CategoryDto } from './dto/category.dto';
import { LikeDto } from './dto/like.dto';
import { JwtPayloadDto } from 'src/user/dto/jwt-payload.dto';
import { ArticleDto } from './dto/article.dto';
import { CommentDto } from './dto/comment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<CategoryDocument>,
    @InjectModel('Article') private articleModel: Model<ArticleDocument>,
    @InjectModel('Like') private likeModel: Model<LikeDocument>,
    @InjectModel('Comment') private commentModel: Model<CommentDocument>,
  ) {}

  public async createCategory(
    categoryDto: CategoryDto,
  ): Promise<{ category: CategoryDocument | null; errMessage: string }> {
    const checkCategory = await this.categoryModel.findOne({
      name: categoryDto.name,
    });
    if (checkCategory) {
      return {
        category: null,
        errMessage: 'This category already exist',
      };
    }

    return {
      category: await this.categoryModel.create(categoryDto),
      errMessage: '',
    };
  }

  public async createArticle(
    articleDto: ArticleDto,
    jwtPayloadDto: JwtPayloadDto,
  ): Promise<{ article: ArticleDocument | null; errMessage: string }> {
    const checkCategory = await this.getCategoryById(articleDto.category);
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

  private async getCategoryById(
    categoryId: string,
  ): Promise<CategoryDocument | null> {
    return this.categoryModel.findById({ _id: categoryId });
  }
}
