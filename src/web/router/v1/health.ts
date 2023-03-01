import { Router } from "express";

export const newHealthRouter = async (): Promise<Router> => {
    const healthRouter = Router();

    healthRouter.get("/", (req, res) => {
        return res.status(200).send({
            code: "SUCCESS",
            message: "Welcome to User Blog API",
            response: null,
            error: null
        });
    });

    return healthRouter;
};