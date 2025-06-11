//This is the task controller
/*
I have to write following controllers for the task
1. createTask
2. getAllTasks
3. updateTask
4. deleteTask
 */

import { Category } from "../models/category.model.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";

// function for creating a task
const createTask = async (req, res) => {
  const userId = req.user?._id;
  const { title, categoryId, status, date } = req.body;

  try {
    if (!userId) return res.status(400).json({ message: "user not found" });
    if (!categoryId) return res.status(400).json({ message: "Please provide categoryId" });
    if (!title) return res.status(400).json({ message: "Please provide task title" });

    // Optionally, check if the category exists for this user
    const existingCategory = await Category.findOne({ _id: categoryId, userId });
    if (!existingCategory) {
      return res.status(400).json({ message: "Category not found for this user" });
    }

    // Check for duplicate task title in the same category for this user
    const duplicateTask = await Task.findOne({ 
      title: title.trim(), 
      categoryId, 
      userId 
    });
    if (duplicateTask) {
      return res.status(409).json({ message: "A task with this title already exists in this category." });
    }

    const newTask = new Task({
      title: title.trim(),
      categoryId,
      status: status || "pending",
      userId,
      date: date || new Date(),
    });

    const savedTask = await newTask.save();

    return res.status(201).json(savedTask);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error while creating task", error: error.message });
  }
};

// function for Updating a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    //debugging
    const task = await Task.findOne({ _id: id, userId: req.user._id });
    //console.log('Fetched task:', task);
    
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// function for deleting a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findOneAndDelete({ _id: id, userId: req.user._id });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

//function for getting all the task of a particular user
const getAllTasks = async(req,res) => {
    const id = req.user?._id; //from middleware verifyToken

    const allTasks = await Task.find({userId: id});

    if(!allTasks) return res.status(400).json({message:"No tasks exist"});

    return res.status(200)
    .json({
        tasks: allTasks,
        message: "tasks fetched successfully"
    })
}

//function for getting tasks by date
const getTaskByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.params;

    if (!date) return res.status(400).json({ message: "Date is required" });

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1); // next day same time

    const tasks = await Task.find({
      userId,
      date: {
        $gte: start,
        $lt: end,
      }
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks by date" });
  }
};

//function for getting tasks by category
const getTaskByCategory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { categoryId } = req.params;

    if (!categoryId) return res.status(400).json({ message: "Not a valid category" });

    const fetchedTasks = await Task.find({ categoryId, userId });

    if (fetchedTasks.length === 0) {
      return res.status(404).json({ message: "No tasks exist for this category" });
    }

    return res.status(200).json({
      fetchedTasks,
      message: "Tasks fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

//function for sharing tasks
const shareTask = async (req, res) => {
  const { email } = req.body;
  const { taskId } = req.params; // Assuming you're passing taskId in the route
  const requesterId = req.user._id; // Assuming you're using auth middleware

  try {
    // 1. Check if user exists
    const shareWith = await User.findOne({ email });
    if (!shareWith) {
      return res.status(404).json({ message: "The user does not exist" });
    }

    // 2. Find the task to share
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 3. Check if the requester is the task owner
    if (!task.userId.equals(requesterId)) {
      return res.status(403).json({ message: "You are not authorized to share this task" });
    }

    // 4. Check if already shared
    const alreadyShared = task.sharedWith.some(entry =>
      entry.user.toString() === shareWith._id.toString()
    );
    if (alreadyShared) {
      return res.status(409).json({ message: "Task already shared with this user" });
    }

    // 5. Share the task
    task.sharedWith.push({ user: shareWith._id }); // you can also add `canEdit: true/false`
    await task.save();

    return res.status(200).json({ message: "Task shared successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getTaskByDate,
  getTaskByCategory,
  shareTask
}