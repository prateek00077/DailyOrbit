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

//function for creating a task
const createTask = async(req,res) => {
    const userId = req.user?._id;
    const {title,date,category} = req.body;

    try {
        if(!userId) return res.status(400).json({message:"user not found"});

        if(!category) return res.status(400).json({message:"Please provide category"});

        if(!title) return res.status(400).json({message: "Please provide task title"});

        let existingCategory = await Category.findOne({title: category});

        if(!existingCategory){
            existingCategory = new Category({
            title: category,
            userId,
            description: "",
            colorCode: "#000000", // default color
            date: new Date(), // or req.body.date if needed
            });

            await existingCategory.save();
        }

        const taskExist = await Task.findOne({$and: [{title:title},{categoryId:existingCategory._id}]});

        if(taskExist) return res.status(400).json({message:"Task aleady exist"});

        if(!existingCategory) return res.status(500).json("Internal server error");

        const newTask = new Task({
            title,
            userId,
            categoryId: existingCategory._id,
            date
        });

        const savedTask = await newTask.save();
        return res.status(200).json({
            _id: savedTask._id,
            title: savedTask.title,
            userId: savedTask.userId,
            categoryId: savedTask.categoryId,
            date: savedTask.date,
            message: "Task created successfully"
        })

    } catch (error) {
        throw new Error(error.message);
    }
}

// function for Updating a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    //debugging
    console.log('Task ID:', req.params.id);
    console.log('User ID:',req.user._id);
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
        allTasks,
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


export {createTask, updateTask,deleteTask, getAllTasks, getTaskByDate,getTaskByCategory}