import { Router } from "express";
import { createCategory } from "../controllers/category.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.route("/create").post(verifyToken, createCategory);

export default categoryRouter;