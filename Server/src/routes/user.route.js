import { Router } from "express";
import { deleteUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyToken, logoutUser);
userRouter.route("/delete").delete(verifyToken,deleteUser);

export default userRouter;