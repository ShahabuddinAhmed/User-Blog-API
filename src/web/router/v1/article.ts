import { Router } from "express";
import { ArticleControllerInterface } from "../../controller/article";

export const newArticleRouter = async (
  articleController: ArticleControllerInterface
): Promise<Router> => {
  const router = Router();
  router.post("/create", articleController.create);
  router.post("/leaveComment", articleController.leaveComment);
  router.post("/createCategory", articleController.createCategory);
  router.post("/addLike", articleController.addLike);
  router.get("/list", articleController.get);
  router.get("/detail", articleController.getById);
  return router;
};
