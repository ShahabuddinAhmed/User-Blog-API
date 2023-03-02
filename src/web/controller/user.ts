import { Request, Response } from "express";
import { UserServiceInterface } from "../../service/user";
import { UserInterface, SortType } from "../../model/user";
import { UserSerializer } from "../serializer/user";
import { Controller } from "./controller";
import { skipLimitParser } from "./helper";
import { object, string, number } from "joi";
import { LoggerInterface } from "../../infra/logger";

export interface UserControllerInterface {
  create(req: Request, res: Response): any;
  update(req: Request, res: Response): any;
  getLike(req: Request, res: Response): any;
}

export class UserController
  extends Controller
  implements UserControllerInterface
{
  userService: UserServiceInterface;
  logger: LoggerInterface;
  constructor(userService: UserServiceInterface, logger: LoggerInterface) {
    super();
    this.userService = userService;
    this.logger = logger;
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.getLike = this.getLike.bind(this);
  }

  public async create(req: Request, res: Response) {
    const schema = object().keys({
      firstName: string().required(),
      lastName: string().required().allow(""),
      password: string().required().min(8),
      email: string().email().required(),
      mobile: string().required().allow(""),
      address: string().required().allow(""),
    });

    const { error, value: castedUser } = schema.validate(req.body, {
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
      console.log(castedUser);
      const { user, errMessage } = await this.userService.create(
        castedUser as UserInterface
      );
      if (!user || errMessage) {
        return await this.sendResponse(
          400,
          "E_EXIST_USER",
          errMessage,
          null,
          [],
          res
        );
      }

      const response = await UserSerializer.serializeUser(user);
      return await this.sendResponse(
        201,
        "SUCCESS",
        "User Successfully created",
        response,
        [],
        res
      );
    } catch (err) {
      this.logger.error("Failed create handler", "user.handler.create", {
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

  public async update(req: Request, res: Response) {
    const schema = object().keys({
      userId: string().required(),
      firstName: string().required(),
      lastName: string().required().allow(""),
      mobile: string().required().allow(""),
      address: string().required().allow(""),
    });

    const { error, value: castedUpdateUser } = schema.validate(req.body, {
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
      const { userId, ...toUpdateUser } = castedUpdateUser;
      const { user, errMessage } = await this.userService.update(
        userId,
        toUpdateUser as UserInterface
      );
      if (!user || errMessage) {
        return await this.sendResponse(
          400,
          "E_UPDATE_USER",
          errMessage,
          null,
          [],
          res
        );
      }

      const response = await UserSerializer.serializeUser(user);
      return await this.sendResponse(
        200,
        "SUCCESS",
        "User Successfully updated.",
        response,
        [],
        res
      );
    } catch (err) {
      this.logger.error("Failed update handler", "user.handler.update", {
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

  public async getLike(req: Request, res: Response) {
    const schema = object().keys({
      user: string().required(),
      skip: number().integer().optional(),
      limit: number().integer().optional(),
      sort: string().valid(SortType.ASC, SortType.DESC).optional(),
    });

    const { error, value: castedLikeData } = schema.validate(req.query, {
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
      const { skip, limit } = skipLimitParser(castedLikeData);
      const userLikes = await this.userService.getLike(
        castedLikeData.user,
        skip,
        limit,
        castedLikeData.sort
      );
      const count = await this.userService.count(castedLikeData.userId);

      const response = await UserSerializer.serializeLikes(userLikes);
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

export const newUserController = async (
  userService: UserServiceInterface,
  logger: LoggerInterface
): Promise<UserController> => {
  return new UserController(userService, logger);
};
