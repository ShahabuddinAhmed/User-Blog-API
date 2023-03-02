import { CommentInterface } from "../model/comment";
import { LikeInterface } from "../model/like";
import { CategoryInterface } from "../model/category";
import { ArticleInterface } from "../model/article";
import { UserRepoInterface } from "../repo/user";
import { BlogRepoInterface } from "../repo/blog";
import { SortType } from "../model/user";

export interface BlogServiceInterface {
  createArticle(
    article: ArticleInterface
  ): Promise<{ article: ArticleInterface | null; errMessage: string }>;
  getArticle(skip: number, limit: number, sort: SortType): Promise<ArticleInterface[]>;
  getArticleById(
    articleId: string
  ): Promise<{ article: ArticleInterface | null; errMessage: string }>;
  countArticle(): Promise<number>;
  leaveComment(
    comment: CommentInterface
  ): Promise<{ comment: CommentInterface | null; errMessage: string }>;
  createCategory(
    category: CategoryInterface
  ): Promise<{ category: CategoryInterface | null; errMessage: string }>;
  addLike(
    like: LikeInterface
  ): Promise<{ like: LikeInterface | null; errMessage: string }>;
}

export class BlogService implements BlogServiceInterface {
  constructor(
    public userRepo: UserRepoInterface,
    public blogRepo: BlogRepoInterface
  ) {
    this.userRepo = userRepo;
    this.blogRepo = blogRepo;
  }

  public async createArticle(
    article: ArticleInterface
  ): Promise<{ article: ArticleInterface | null; errMessage: string }> {
    const checkUser = await this.userRepo.getById(article.user as string);
    if (!checkUser) {
      return { article: null, errMessage: "Invalid userId" };
    }

    const checkCategory = await this.blogRepo.getCategoryById(
      article.category as string
    );
    if (!checkCategory) {
      return { article: null, errMessage: "Invalid Category" };
    }

    return {
      article: await this.blogRepo.createArticle(article),
      errMessage: "",
    };
  }

  public async getArticle(
    skip: number,
    limit: number,
    sort: SortType
  ): Promise<ArticleInterface[]> {
    return this.blogRepo.getArticle(skip, limit, sort);
  }

  public async getArticleById(
    articleId: string
  ): Promise<{ article: ArticleInterface | null; errMessage: string }> {
    const checkArticle = await this.blogRepo.getArticleById(articleId);
    return {
      article: checkArticle,
      errMessage: checkArticle ? "" : "Invalid articleId",
    };
  }

  public async countArticle(): Promise<number> {
    return this.blogRepo.countArticle();
  }

  public async leaveComment(
    comment: CommentInterface
  ): Promise<{ comment: CommentInterface | null; errMessage: string }> {
    return {
      comment: await this.blogRepo.leaveComment(comment),
      errMessage: "",
    };
  }

  public async createCategory(
    category: CategoryInterface
  ): Promise<{ category: CategoryInterface | null; errMessage: string }> {
    return {
      category: await this.blogRepo.createCategory(category),
      errMessage: "",
    };
  }

  public async addLike(
    like: LikeInterface
  ): Promise<{ like: LikeInterface | null; errMessage: string }> {
    return {
      like: await this.blogRepo.addLike(like),
      errMessage: "",
    };
  }
}

export const newBlogService = async (
  userRepo: UserRepoInterface,
  blogRepo: BlogRepoInterface
) => {
  return new BlogService(userRepo, blogRepo);
};
