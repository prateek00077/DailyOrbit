//Here i have to define four major functions
//1. createCategory
//2. getAllCategories
//4. deleteCategory

import { Category } from "../models/category.model.js";
import { Progress } from "../models/progress.model.js";
import { Task } from "../models/task.model.js";

//function for creating new category
const createCategory = async (req, res) => {
  try {
    const { title, description, colorCode, date } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Please provide a valid title" });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Check if category with same title exists for this user
    const existingCategory = await Category.findOne({ title, userId: user._id });
    if (existingCategory) {
      return res.status(400).json({ message: "This category already exists" });
    }

    const newCategory = new Category({
      title,
      description,
      colorCode,
      userId: user._id,
      date,
    });

    const savedCategory = await newCategory.save();

    return res.status(201).json({
      _id: savedCategory._id,
      title: savedCategory.title,
      description: savedCategory.description,
      colorCode: savedCategory.colorCode,
      date: savedCategory.date,
      userId: savedCategory.userId,
      message: "Category created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error while creating category",
      error: err.message,
    });
  }
};

//function for getting all the categories
const getAllCategories = async (req,res)=>{
  //first we have to get verify the user to get user that is done by middleware
  const userId = req.user._id;
  
  if(!userId) return res.status(401).json({message: "user not found"});

  const categories = await Category.find({userId});

  if(!categories) return res.status(500).json("Internal server error");

  return res.status(200).json({
    categories,
    message: "categories fetched successfully"
  });
}

//function for deleting category
const deleteCategory = async(req,res)=>{
  //we get the user by middleware
  try {
    const userId = req.user?._id;
    const {title} = req.body;
    const categoryTobeDeleted = await Category.findOne({title});

    if(!categoryTobeDeleted) return res.status(400).json("No category found by this name");
    
    if(!userId) return res.status(400).json("No user found");

    await Task.deleteMany({categoryId: categoryTobeDeleted._id});
    await Progress.deleteMany({categoryId: categoryTobeDeleted._id});
    await Category.deleteOne({_id: categoryTobeDeleted._id});

    return res.status(200).json("Category deleted successfully");
  } catch (error) {
    throw new Error("Message: ",error.message);
  }
}

// In category.controller.js
const deleteCategoryById = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    const categoryTobeDeleted = await Category.findOne({ _id: id, userId });

    if (!categoryTobeDeleted) return res.status(400).json("No category found by this id");
    if (!userId) return res.status(400).json("No user found");

    await Task.deleteMany({ categoryId: categoryTobeDeleted._id });
    await Progress.deleteMany({ categoryId: categoryTobeDeleted._id });
    await Category.deleteOne({ _id: categoryTobeDeleted._id });

    return res.status(200).json("Category deleted successfully");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {createCategory,getAllCategories,deleteCategory,deleteCategoryById}