import { Router } from "express";
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from "../controllers/notification.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const notificationRouter = Router();

// All notification routes require authentication
notificationRouter.use(verifyToken);

notificationRouter.route("/").get(getNotifications);
notificationRouter.route("/unread-count").get(getUnreadCount);
notificationRouter.route("/mark-all-read").put(markAllAsRead);
notificationRouter.route("/:notificationId/mark-read").put(markAsRead);

export default notificationRouter;
