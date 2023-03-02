import { Router } from "express";
import { BlogControllerInterface } from "../../controller/blog";

export const newBlogRouter = async (
  blogController: BlogControllerInterface
): Promise<Router> => {
  const router = Router();
  router.post("/article/create", blogController.createArticle);
  router.get("/article/list", blogController.getArticle);
  router.get("/article/detail", blogController.getArticleById);
  router.post("/leaveComment", blogController.leaveComment);
  router.post("/createCategory", blogController.createCategory);
  router.post("/addLike", blogController.addLike);
  return router;
};
