import { CommentInterface } from "./../../model/comment";
import { LikeInterface } from "../../model/like";
import { CategoryInterface } from "../../model/category";
import { Request, Response } from "express";
import { ArticleServiceInterface } from "../../service/article";
import { ArticleInterface } from "../../model/article";
import { ArticleSerializer } from "../serializer/article";
import { Controller } from "./controller";
import { object, string, number, boolean } from "joi";
import { LoggerInterface } from "../../infra/logger";
import { SortType } from "../../model/user";
import { skipLimitParser } from "./helper";

export interface ArticleControllerInterface {
  create(req: Request, res: Response): any;
  leaveComment(req: Request, res: Response): any;
  createCategory(req: Request, res: Response): any;
  addLike(req: Request, res: Response): any;
  get(req: Request, res: Response): any;
  getById(req: Request, res: Response): any;
}

export class ArticleController
  extends Controller
  implements ArticleControllerInterface
{
  articleService: ArticleServiceInterface;
  logger: LoggerInterface;
  constructor(
    articleService: ArticleServiceInterface,
    logger: LoggerInterface
  ) {
    super();
    this.articleService = articleService;
    this.logger = logger;
    this.create = this.create.bind(this);
    this.leaveComment = this.leaveComment.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.addLike = this.addLike.bind(this);
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
  }

  public async create(req: Request, res: Response) {
    const schema = object().keys({
      title: string().required(),
      subTitle: string().required(),
      slug: string().required(),
      content: string().required(),
      category: string().required(),
      user: string().required(),
    });

    const { error, value: castedArticle } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return await this.sendResponse(
        400,
        "E_INVALID_DATA",
        "Please fill up all the required fields.",
        null,
        error.details,
        res
      );
    }

    try {
      const { article, errMessage } = await this.articleService.create(
        castedArticle as ArticleInterface
      );

      if (!article || errMessage) {
        return await this.sendResponse(
          400,
          "E_CREATE_ARTICLE",
          errMessage,
          null,
          [],
          res
        );
      }

      const response = await ArticleSerializer.serializeArticle(article);
      return await this.sendResponse(
        200,
        "SUCCESS",
        "Article Successfully created",
        response,
        [],
        res
      );
    } catch (err) {
      this.logger.error("Failed getLike handler", "user.handler.getLike", {
        error: err,
      });
      return await this.sendResponse(
        500,
        "E_INTERNAL_SERVER_ERROR",
        "Internal Server Error",
        null,
        [],
        res
      );
    }
  }

  public async createCategory(req: Request, res: Response) {
    const schema = object().keys({
      name: string().required(),
      slug: string().required(),
    });

    const { error, value: castedCreateCategory } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return await this.sendResponse(
        400,
        "E_INVALID_DATA",
        "Please fill up all the required fields.",
        null,
        error.details,
        res
      );
    }

    try {
      const { category, errMessage } = await this.articleService.createCategory(
        castedCreateCategory as CategoryInterface
      );

      if (!category || errMessage) {
        return await this.sendResponse(
          400,
          "E_CREATE_ARTICLE",
          errMessage,
          null,
          [],
          res
        );
      }

      // const response = await ArticleSerializer.serializeArticle(category);
      return await this.sendResponse(
        200,
        "SUCCESS",
        "Article Successfully created",
        category,
        [],
        res
      );
    } catch (err) {
      this.logger.error("Failed getLike handler", "user.handler.getLike", {
        error: err,
      });
      return await this.sendResponse(
        500,
        "E_INTERNAL_SERVER_ERROR",
        "Internal Server Error",
        null,
        [],
        res
      );
    }
  }

  public async leaveComment(req: Request, res: Response) {
    const schema = object().keys({
      content: string().required(),
      article: string().required(),
      user: string().required(),
    });

    const { error, value: castedLeaveComment } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return await this.sendResponse(
        400,
        "E_INVALID_DATA",
        "Please fill up all the required fields.",
        null,
        error.details,
        res
      );
    }

    try {
      const { comment, errMessage } = await this.articleService.leaveComment(
        castedLeaveComment as CommentInterface
      );

      if (!comment || errMessage) {
        return await this.sendResponse(
          400,
          "E_CREATE_COMMENT",
          errMessage,
          null,
          [],
          res
        );
      }

      // const response = await ArticleSerializer.serializeArticle(category);
      return await this.sendResponse(
        200,
        "SUCCESS",
        "Comment Successfully created",
        comment,
        [],
        res
      );
    } catch (err) {
      this.logger.error("Failed leaveComment handler", "user.handler.leaveComment", {
        error: err,
      });
      return await this.sendResponse(
        500,
        "E_INTERNAL_SERVER_ERROR",
        "Internal Server Error",
        null,
        [],
        res
      );
    }
  }

  public async addLike(req: Request, res: Response) {
    const schema = object().keys({
      isLike: boolean().required(),
      article: string().required(),
      user: string().required(),
    });

    const { error, value: castedRequest } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return await this.sendResponse(
        400,
        "E_INVALID_DATA",
        "Please fill up all the required fields.",
        null,
        error.details,
        res
      );
    }

    try {
      const { like, errMessage } = await this.articleService.addLike(
        castedRequest as LikeInterface
      );

      if (!like || errMessage) {
        return await this.sendResponse(
          400,
          "E_CREATE_ARTICLE",
          errMessage,
          null,
          [],
          res
        );
      }

      // const response = await ArticleSerializer.serializeArticle(category);
      return await this.sendResponse(
        200,
        "SUCCESS",
        "Article Successfully created",
        like,
        [],
        res
      );
    } catch (err) {
      this.logger.error("Failed getLike handler", "user.handler.getLike", {
        error: err,
      });
      return await this.sendResponse(
        500,
        "E_INTERNAL_SERVER_ERROR",
        "Internal Server Error",
        null,
        [],
        res
      );
    }
  }

  public async get(req: Request, res: Response) {
    const schema = object().keys({
      skip: number().integer().optional(),
      limit: number().integer().optional(),
      sort: string().valid(SortType.ASC, SortType.DESC).optional(),
    });

    const { error, value: castedRequest } = schema.validate(req.query, {
      abortEarly: false,
    });
    if (error) {
      return await this.sendResponse(
        400,
        "E_INVALID_DATA",
        "Please fill up all the required fields.",
        null,
        error.details,
        res
      );
    }

    try {
      const { skip, limit } = skipLimitParser(castedRequest);
      const articles = await this.articleService.get(
        skip,
        limit,
        castedRequest.sort
      );

      const count = await this.articleService.count();

      const response = await ArticleSerializer.serializeArticles(articles);
      return await this.sendResponse(
        200,
        "SUCCESS",
        "User ",
        response,
        [],
        res,
        { skip, limit, count }
      );
    } catch (err) {
      this.logger.error("Failed getLike handler", "user.handler.getLike", {
        error: err,
      });
      return await this.sendResponse(
        500,
        "E_INTERNAL_SERVER_ERROR",
        "Internal Server Error",
        null,
        [],
        res
      );
    }
  }

  public async getById(req: Request, res: Response) {
    const schema = object().keys({
      article: string().required(),
    });

    const { error, value: castedRequest } = schema.validate(req.query, {
      abortEarly: false,
    });
    if (error) {
      return await this.sendResponse(
        400,
        "E_INVALID_DATA",
        "Please fill up all the required fields.",
        null,
        error.details,
        res
      );
    }

    try {
      const { article, errMessage } = await this.articleService.getById(
        castedRequest.article
      );

      if (!article || errMessage) {
        return await this.sendResponse(
          400,
          "E_CREATE_ARTICLE",
          errMessage,
          null,
          [],
          res
        );
      }

      console.log(article);

      const response = await ArticleSerializer.serializeArticle(article);
      return await this.sendResponse(
        200,
        "SUCCESS",
        "User ",
        response,
        [],
        res
      );
    } catch (err) {
      this.logger.error("Failed getLike handler", "user.handler.getLike", {
        error: err,
      });
      return await this.sendResponse(
        500,
        "E_INTERNAL_SERVER_ERROR",
        "Internal Server Error",
        null,
        [],
        res
      );
    }
  }

  public async sendResponse(
    statusCode: number,
    code: string,
    message: string,
    data: any,
    errors: any[],
    res: Response,
    optional?: object
  ): Promise<any> {
    return res
      .status(statusCode)
      .send({ code, message, data, errors, ...optional });
  }
}

export const newArticleController = async (
  articleService: ArticleServiceInterface,
  logger: LoggerInterface
): Promise<ArticleController> => {
  return new ArticleController(articleService, logger);
};
