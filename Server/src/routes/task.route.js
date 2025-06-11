import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { createTask, deleteTask, getAllTasks, getTaskByCategory, getTaskByDate, getTasksSharedToMe, shareTask, updateTask, updateTaskStatus } from "../controllers/task.controller.js";

const taskRouter = Router();
taskRouter.use(verifyToken);
taskRouter.route('/create').post(createTask);
taskRouter.route('/update/:id').put(updateTask);
taskRouter.route('/delete/:id').delete(deleteTask);
taskRouter.route('/get').get(getAllTasks);
taskRouter.route('/date/:date').get(getTaskByDate);
taskRouter.route('/category/:categoryId').get(getTaskByCategory);
taskRouter.route('/share/:taskId').post(shareTask);
taskRouter.route('/shared').get(getTasksSharedToMe);
taskRouter.route('/update-status/:taskId').put(updateTaskStatus);

export default taskRouter;