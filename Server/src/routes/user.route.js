import { Router } from "express";
import { deleteUser, loginUser, logoutUser, registerUser, resendOTP, verifyUserEmail} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyToken, logoutUser);
userRouter.route("/delete").delete(verifyToken,deleteUser);
userRouter.route("/verify-email").post(verifyUserEmail);
userRouter.route("/resend-otp").post(resendOTP);

export default userRouter;