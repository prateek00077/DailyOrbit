//Here i have to define four major functions
//1. createCategory
//2. getAllCategories
//3. getOneCategory
//4. deleteCategory

import { Category } from "../models/category.model.js";

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


export {createCategory}