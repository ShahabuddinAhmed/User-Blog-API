import { CategoryInterface, CategoryModel } from "../model/category";
import { UpdateResult } from "mongodb";
import { Types } from "mongoose";
import { CommentModel, CommentInterface } from "../model/comment";
import { LikeModel, LikeInterface } from "../model/like";
import { ArticleInterface, ArticleModel } from "../model/article";
import { SortType } from "../model/user";

export interface BlogRepoInterface {
  createArticle(article: ArticleInterface): Promise<ArticleInterface>;
  getArticle(
    skip: number,
    limit: number,
    sort: SortType
  ): Promise<ArticleInterface[]>;
  getArticleById(articleId: string): Promise<ArticleInterface | null>;
  leaveComment(comment: CommentInterface): Promise<CommentInterface>;
  giveLike(
    userId: string,
    articleId: string,
    isLike: boolean
  ): Promise<LikeInterface>;
  countArticle(): Promise<number>;
  createCategory(category: CategoryInterface): Promise<CategoryInterface>;
  getCategoryById(categoryId: string): Promise<CategoryInterface | null>;
  getCategoryByName(search: string): Promise<CategoryInterface[]>;
  addLike(like: LikeInterface): Promise<LikeInterface>;
}

export class BlogRepo implements BlogRepoInterface {
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

  public async createArticle(
    article: ArticleInterface
  ): Promise<ArticleInterface> {
    return this.articleModel.create(article);
  }

  private async updateArticleById(
    articleId: string,
    commentId: string
  ): Promise<UpdateResult> {
    return this.articleModel.updateOne(
      { _id: articleId },
      { $push: { comments: commentId } }
    );
  }

  public async getArticle(
    skip: number,
    limit: number,
    sort: SortType
  ): Promise<ArticleInterface[]> {
    return this.articleModel.find({}, ["title", "subTitle", "slug"], {
      skip,
      limit,
      sort: { createdAt: sort === SortType.ASC ? 1 : -1 },
    });
  }

  public async getArticleById(
    articleId: string
  ): Promise<ArticleInterface | null> {
    return await this.articleModel
      .findById({ _id: articleId })
      .populate("comments")
      .populate("category");
  }

  public async createCategory(
    category: CategoryInterface
  ): Promise<CategoryInterface> {
    return this.categoryModel.create(category);
  }

  public async getCategoryById(
    categoryId: string
  ): Promise<CategoryInterface | null> {
    return this.categoryModel.findById({ _id: categoryId });
  }

  public async getCategoryByName(
    search: string
  ): Promise<CategoryInterface[]> {
    return this.categoryModel.find({
      name: { $regex: `.*${search}.*`, $options: "i" },
    });
  }

  public async addLike(like: LikeInterface): Promise<LikeInterface> {
    return this.likeModel.create(like);
  }

  public async countArticle(): Promise<number> {
    return this.articleModel.count();
  }

  /**
   *
   * @param comment Here is execute multiple db operations. will be add transaction later
   * @returns
   */
  public async leaveComment(
    comment: CommentInterface
  ): Promise<CommentInterface> {
    const checkExistingComment = await this.getCommentByArticleId(
      comment.article as string
    );
    if (!checkExistingComment) {
      const parent = new Types.ObjectId();
      const createdComment = await this.commentModel.create({
        _id: parent,
        ...comment,
        parent,
      });
      await this.updateArticleById(
        comment.article as string,
        createdComment.id as string
      );
      return createdComment;
    }

    const createdComment = await this.commentModel.create({
      ...comment,
      parent: checkExistingComment.id,
    });

    await this.updateArticleById(
      comment.article as string,
      createdComment.id as string
    );
    return createdComment;
  }

  private async getCommentByArticleId(
    article: string
  ): Promise<CommentInterface | null> {
    return this.commentModel.findOne({ article });
  }

  public async giveLike(
    userId: string,
    articleId: string,
    isLike: boolean
  ): Promise<LikeInterface> {
    return this.likeModel.create({ userId, articleId, isLike });
  }
}

export const newBlogRepo = async (
  articleModel: typeof ArticleModel,
  commentModel: typeof CommentModel,
  likeModel: typeof LikeModel,
  categoryModel: typeof CategoryModel
): Promise<BlogRepoInterface> => {
  return new BlogRepo(articleModel, commentModel, likeModel, categoryModel);
};

export default BlogRepo;
