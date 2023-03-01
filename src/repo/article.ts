import { CategoryInterface, CategoryModel } from "./../model/category";
import { Types } from "mongoose";
import { CommentModel, CommentInterface } from "./../model/comment";
import { LikeModel, LikeInterface } from "./../model/like";
import { ArticleInterface, ArticleModel } from "../model/article";
import { SortType } from "../model/user";

export interface ArticleRepoInterface {
  create(article: ArticleInterface): Promise<ArticleInterface>;
  get(skip: number, limit: number, sort: SortType): Promise<ArticleInterface[]>;
  getById(articleId: string): Promise<ArticleInterface | null>;
  leaveComment(
    userId: string,
    articleId: string,
    content: string
  ): Promise<CommentInterface>;
  giveLike(
    userId: string,
    articleId: string,
    isLike: boolean
  ): Promise<LikeInterface>;
  count(): Promise<number>;
  getCategoryById(categoryId: string): Promise<CategoryInterface | null>;
}

export class ArticleRepo implements ArticleRepoInterface {
  constructor(
    public articleModel: typeof ArticleModel,
    public commentModel: typeof CommentModel,
    public likeModel: typeof LikeModel,
    public categoryModel: typeof CategoryModel
  ) {
    this.articleModel = articleModel;
    this.commentModel = commentModel;
    this.likeModel = likeModel;
    this.categoryModel = categoryModel;
  }

  public async create(article: ArticleInterface): Promise<ArticleInterface> {
    return this.articleModel.create(article);
  }

  public async get(
    skip: number,
    limit: number,
    sort: SortType
  ): Promise<ArticleInterface[]> {
    return this.articleModel.find(
      {},
      { content: -1, user: -1 },
      { skip, limit, sort: { createdAt: sort === SortType.ASC ? 1 : -1 } }
    );
  }

  public async getById(articleId: string): Promise<ArticleInterface | null> {
    return this.articleModel.findById({ _id: articleId }).populate("category");
  }

  public async getCategoryById(categoryId: string): Promise<CategoryInterface | null> {
    return this.categoryModel.findById({ _id: categoryId });
  }

  public async count(): Promise<number> {
    return this.articleModel.count();
  }

  public async leaveComment(
    userId: string,
    articleId: string,
    content: string
  ): Promise<CommentInterface> {
    const checkExistingComment = await this.getCommentByArticleId(articleId);
    if (!checkExistingComment) {
      const parentId = new Types.ObjectId();
      return this.commentModel.create({
        _id: parentId,
        userId,
        articleId,
        parentId,
        content,
      });
    }

    return this.commentModel.create({
      userId,
      articleId,
      parentId: checkExistingComment.id,
      content,
    });
  }

  public async getCommentByArticleId(
    articleId: string
  ): Promise<ArticleInterface> {
    return this.commentModel.findOne({ articleId }).populate("category");
  }

  public async giveLike(
    userId: string,
    articleId: string,
    isLike: boolean
  ): Promise<LikeInterface> {
    return this.likeModel.create({ userId, articleId, isLike });
  }
}

export const newArticleRepo = async (
  articleModel: typeof ArticleModel,
  commentModel: typeof CommentModel,
  likeModel: typeof LikeModel,
  categoryModel: typeof CategoryModel
): Promise<ArticleRepoInterface> => {
  return new ArticleRepo(articleModel, commentModel, likeModel, categoryModel);
};

export default ArticleRepo;
