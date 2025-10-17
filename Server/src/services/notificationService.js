import { Notification } from "../models/notification.model.js";

export const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    const savedNotification = await notification.save();
    
    // Send real-time notification via Socket.IO
    if (global.io && global.userSockets) {
      const userSocketId = global.userSockets.get(notificationData.userId.toString());
      if (userSocketId) {
        global.io.to(userSocketId).emit('notification', savedNotification);
      }
    }
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const createTaskSharedNotification = async (recipientUserId, sharerName, taskTitle) => {
  const notificationData = {
    userId: recipientUserId,
    type: "task_shared",
    title: "Task Shared",
    message: `${sharerName} shared a task "${taskTitle}" with you`,
    data: {
      taskTitle,
      sharerName
    }
  };
  
  return await createNotification(notificationData);
};

export const createTaskUpdatedNotification = async (recipientUserId, updaterName, taskTitle) => {
  const notificationData = {
    userId: recipientUserId,
    type: "task_updated",
    title: "Task Updated",
    message: `${updaterName} updated the task "${taskTitle}"`,
    data: {
      taskTitle,
      updaterName
    }
  };
  
  return await createNotification(notificationData);
};

export const createTaskCompletedNotification = async (recipientUserId, completerName, taskTitle) => {
  const notificationData = {
    userId: recipientUserId,
    type: "task_completed",
    title: "Task Completed",
    message: `${completerName} completed the task "${taskTitle}"`,
    data: {
      taskTitle,
      completerName
    }
  };
  
  return await createNotification(notificationData);
};

export const getUserNotifications = async (userId, limit = 20, skip = 0) => {
  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
    return notifications;
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    
    return result;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const getUnreadNotificationCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({ userId, isRead: false });
    return count;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    throw error;
  }
};
