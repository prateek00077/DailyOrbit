import { Category } from "../models/category.model.js";
import { Task } from "../models/task.model.js";
import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";


//function for user registration
const registerUser = async(req,res)=>{
    const {username, email, password, fullname} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({message: "Please fill required fields"});
    }

    if(password.length < 6){
        return res.status(400).json({message: "Password must be at least 6 characters"});
    }

    await User.findOne({username}).then((userExists)=>{
        if(userExists){
            return res.status(400).json({message : "This username is already taken"});
        }
    });

    await User.findOne({email}).then((userExists)=>{
        if(userExists){
            return res.status(400).json({message : "This email is already registered"});
        }
    });

    //creating new user
    const newUser = new User({
        username,
        fullname,
        email,
        password: bcrypt.hashSync(password, 10),
    });

    if(!newUser) throw new Error("Something went wrong while creating the new user");
    await newUser.save();

    // Add default category for the new user
    const defaultCategory = new Category({
      title: "General",
      description: "Default category",
      colorCode: "#4F46E5", // or any default color
      userId: newUser._id,
      date: new Date(),
    });

    await defaultCategory.save();

    try {
        return res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            fullname: newUser.fullname,
            email: newUser.email,
            message: "User registered successfully",
        })
    } catch (error) {
        return res.status(500).json({message: error.message?error.message : "Internal server error"});
    }
}

//function for user login
const loginUser = async(req,res)=>{
    //for getting user logged in what steps should i take
    //first of all we will get all the data from req
    //Then we will check if username or email is there or not
    //If not then return "missing"
    //If yes then we have to check password is correct or not
    //If password is correct for that particular username or email then
    //We will generate an access token and refresh token
    //We will send the access token and refresh token in response

    const {email,password} = req.body;

    //validation
    if(!(email?.trim())){
        return res.status(400).json("usrname or email is required");
    }

    //check if password is there
    if(!password?.trim()) throw new Error(400,"password is required to log in");

    //Now we will find the the user who's having the same email or username
    const user = await User.findOne({email});

    //checking if user is there or not
    if(!user) return res.status(400).json("User does not exist");

    //checking if password is valid or not
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) throw new Error("Username or Password is Incorrect");

    //generating access token and refresh token
    try {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        //storing refresh token in database
        await User.findByIdAndUpdate(user._id, {refreshToken});

        //sending response
        return res.status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true
        })
        .json({
            user: {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email
            },
            message: "User logged in successfully",
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.log("error is in catch section");
        throw new Error("Internal server error");
    }
}

//function for user logout
const logoutUser = async(req,res)=>{
    const {refreshToken} = req.cookies;

    if(!refreshToken) throw new Error("Refresh token is required");

    //deleting refresh token from database
    await User.findOneAndUpdate({refreshToken}, {refreshToken: ""}).then(()=>{
        return res.
        clearCookie("accessToken", {
            httpOnly: true,
            secure: true
        }).clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        }) //clearing the cookies
        .status(200).json({message: "User logged out successfully"});
    }).catch((error)=>{
        return res.status(500).json({message: error.message?error.message : "Internal server error"});
    })
}

//function for deleting a user
const deleteUser = async(req,res)=>{
    const userId = req.user._id;
    const {refreshToken} = req.cookies;

    if(!userId) return res.status(401).json({message: "Invalid User"});

    await Task.deleteMany({ userId });
    await Category.deleteMany({ userId });
    /*await Progress.deleteMany({ userId });*/
    await User.findByIdAndDelete(userId);

    await User.findOneAndUpdate({refreshToken}, {refreshToken: ""}).then(()=>{
        return res.
        clearCookie("accessToken", {
            httpOnly: true,
            secure: true
        }).clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        }) //clearing the cookies
        .status(200).json({message: "User deleted successfully"});
    }).catch((error)=>{
        return res.status(500).json({message: error.message?error.message : "Internal server error"});
    })
}

export {registerUser, loginUser, logoutUser, deleteUser};