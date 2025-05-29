import { Router } from "express";
import { createCategory, deleteCategory, deleteCategoryById, getAllCategories } from "../controllers/category.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.use(verifyToken);
categoryRouter.route("/create").post(createCategory);
categoryRouter.route("/get").get(getAllCategories);
categoryRouter.route("/delete").delete(deleteCategory);
categoryRouter.route("/delete/:id").delete(deleteCategoryById)

export default categoryRouter;