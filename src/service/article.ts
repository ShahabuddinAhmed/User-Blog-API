import { CommentInterface } from "./../model/comment";
import { LikeInterface } from "../model/like";
import { CategoryInterface } from "../model/category";
import { ArticleInterface } from "../model/article";
import { UserRepoInterface } from "../repo/user";
import { ArticleRepoInterface } from "../repo/article";
import { SortType } from "../model/user";

export interface ArticleServiceInterface {
  create(
    article: ArticleInterface
  ): Promise<{ article: ArticleInterface | null; errMessage: string }>;
  get(skip: number, limit: number, sort: SortType): Promise<ArticleInterface[]>;
  getById(
    articleId: string
  ): Promise<{ article: ArticleInterface | null; errMessage: string }>;
  count(): Promise<number>;
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

export class ArticleService implements ArticleServiceInterface {
  constructor(
    public userRepo: UserRepoInterface,
    public articleRepo: ArticleRepoInterface
  ) {
    this.userRepo = userRepo;
    this.articleRepo = articleRepo;
  }

  public async create(
    article: ArticleInterface
  ): Promise<{ article: ArticleInterface | null; errMessage: string }> {
    const checkUser = await this.userRepo.getById(article.user as string);
    if (!checkUser) {
      return { article: null, errMessage: "Invalid userId" };
    }

    const checkCategory = await this.articleRepo.getCategoryById(
      article.category as string
    );
    if (!checkCategory) {
      return { article: null, errMessage: "Invalid Category" };
    }

    return {
      article: await this.articleRepo.create(article),
      errMessage: "",
    };
  }

  public async get(
    skip: number,
    limit: number,
    sort: SortType
  ): Promise<ArticleInterface[]> {
    return this.articleRepo.get(skip, limit, sort);
  }

  public async getById(
    articleId: string
  ): Promise<{ article: ArticleInterface | null; errMessage: string }> {
    const checkArticle = await this.articleRepo.getById(articleId);
    return {
      article: checkArticle,
      errMessage: checkArticle ? "" : "Invalid articleId",
    };
  }

  public async count(): Promise<number> {
    return this.articleRepo.count();
  }

  public async leaveComment(
    comment: CommentInterface
  ): Promise<{ comment: CommentInterface | null; errMessage: string }> {
    return {
      comment: await this.articleRepo.leaveComment(comment),
      errMessage: "",
    };
  }
  
  public async createCategory(
    category: CategoryInterface
  ): Promise<{ category: CategoryInterface | null; errMessage: string }> {
    return {
      category: await this.articleRepo.createCategory(category),
      errMessage: "",
    };
  }

  public async addLike(
    like: LikeInterface
  ): Promise<{ like: LikeInterface | null; errMessage: string }> {
    return {
      like: await this.articleRepo.addLike(like),
      errMessage: "",
    };
  }
}

export const newArticleService = async (
  userRepo: UserRepoInterface,
  articleRepo: ArticleRepoInterface
) => {
  return new ArticleService(userRepo, articleRepo);
};
