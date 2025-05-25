import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories } from "../controllers/category.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.route("/create").post(verifyToken, createCategory);
categoryRouter.route("/get").post(verifyToken, getAllCategories);
categoryRouter.route("/delete").post(verifyToken,deleteCategory);

export default categoryRouter;