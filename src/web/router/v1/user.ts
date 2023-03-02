import { Router, } from "express";
import { UserControllerInterface } from "../../controller/user";


export const newUserRouter = async (userController: UserControllerInterface): Promise<Router> => {
    const router = Router();
    router.post("/create", userController.create);
    router.patch("/update", userController.update);
    router.get("/like/list", userController.getLike);
    return router;
};
