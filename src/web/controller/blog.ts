import { CommentInterface } from "../../model/comment";
import { LikeInterface } from "../../model/like";
import { CategoryInterface } from "../../model/category";
import { Request, Response } from "express";
import { BlogServiceInterface } from "../../service/blog";
import { ArticleInterface } from "../../model/article";
import { BlogSerializer } from "../serializer/blog";
import { Controller } from "./controller";
import { object, string, number, boolean } from "joi";
import { LoggerInterface } from "../../infra/logger";
import { SortType } from "../../model/user";
import { skipLimitParser } from "./helper";

export interface BlogControllerInterface {
  createArticle(req: Request, res: Response): any;
  leaveComment(req: Request, res: Response): any;
  createCategory(req: Request, res: Response): any;
  addLike(req: Request, res: Response): any;
  getArticle(req: Request, res: Response): any;
  getArticleById(req: Request, res: Response): any;
}

export class BlogController
  extends Controller
  implements BlogControllerInterface
{
  blogService: BlogServiceInterface;
  logger: LoggerInterface;
  constructor(blogService: BlogServiceInterface, logger: LoggerInterface) {
    super();
    this.blogService = blogService;
    this.logger = logger;
    this.createArticle = this.createArticle.bind(this);
    this.leaveComment = this.leaveComment.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.addLike = this.addLike.bind(this);
    this.getArticle = this.getArticle.bind(this);
    this.getArticleById = this.getArticleById.bind(this);
  }

  public async createArticle(req: Request, res: Response) {
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
      const { article, errMessage } = await this.blogService.createArticle(
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

      const response = await BlogSerializer.serializeArticle(article);
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
      const { category, errMessage } = await this.blogService.createCategory(
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

      // const response = await BlogSerializer.serializeArticle(category);
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
      const { comment, errMessage } = await this.blogService.leaveComment(
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

      // const response = await BlogSerializer.serializeArticle(category);
      return await this.sendResponse(
        200,
        "SUCCESS",
        "Comment Successfully created",
        comment,
        [],
        res
      );
    } catch (err) {
      this.logger.error(
        "Failed leaveComment handler",
        "user.handler.leaveComment",
        {
          error: err,
        }
      );
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
      const { like, errMessage } = await this.blogService.addLike(
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

      // const response = await BlogSerializer.serializeArticle(category);
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

  public async getArticle(req: Request, res: Response) {
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
      const articles = await this.blogService.getArticle(
        skip,
        limit,
        castedRequest.sort
      );

      const count = await this.blogService.countArticle();

      const response = await BlogSerializer.serializeArticles(articles);
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

  public async getArticleById(req: Request, res: Response) {
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
      const { article, errMessage } = await this.blogService.getArticleById(
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

      const response = await BlogSerializer.serializeArticle(article);
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

export const newBlogController = async (
  blogService: BlogServiceInterface,
  logger: LoggerInterface
): Promise<BlogController> => {
  return new BlogController(blogService, logger);
};
