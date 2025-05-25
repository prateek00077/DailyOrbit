import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { createTask } from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.route("/create").post(verifyToken,createTask);

export default taskRouter;