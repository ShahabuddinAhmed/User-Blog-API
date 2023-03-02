import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

import { initializeDBConnection } from "./infra/db";
import { UserModel } from "./model/user";
import { ArticleModel } from "./model/article";
import { CommentModel } from "./model/comment";
import { CategoryModel } from "./model/category";
import { LikeModel } from "./model/like";

import { newUserRepo } from "./repo/user";
import { newArticleRepo } from "./repo/article";

import { newUserService } from "./service/user";
import { newArticleService } from "./service/article";

import { newV1Router } from "./web/router/v1/index";
import { newUserController } from "./web/controller/user";
import { newArticleController } from "./web/controller/article";

import config from "./config/config";
import { newLogManager, newLogManagerStreamer } from "./infra/logger";

const app = express();

// registering app level middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// bootstrapping the application
(async () => {
  // initialize logger
  const logger = await newLogManager();
  const requestLogStreamer = await newLogManagerStreamer(logger);

  // initializing db connection
  const db = await initializeDBConnection(
    config.MONGO.MONGO_HOST,
    config.MONGO.MONGO_DB
  );

  // initializing repos
  const userRepo = await newUserRepo(UserModel, LikeModel);
  const articleRepo = await newArticleRepo(ArticleModel, CommentModel, LikeModel, CategoryModel);

  // initializing services
  const userService = await newUserService(userRepo);
  const articleService = await newArticleService(userRepo, articleRepo);

  // initializing controllers
  const userController = await newUserController(userService, logger);
  const articleController = await newArticleController(articleService, logger);

  //initialize routers
  const v1Router = await newV1Router(userController, articleController);

  app.use(morgan("short", { stream: requestLogStreamer }));
  app.use("/api", v1Router);
})();

export default app;
