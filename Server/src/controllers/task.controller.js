//This is the task controller
/*
I have to write following controllers for the task
1. createTask
2. getTaskByCategory
3. updateTaskStatus
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

export {createTask}