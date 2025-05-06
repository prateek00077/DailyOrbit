import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";

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

    const newUser = new User({
        username,
        fullname,
        email,
        password: bcrypt.hashSync(password, 10),
    });

    await newUser.save().then((user)=>{
        return res.status(201).json({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            message: "User registered successfully",
        })
    }).catch((error)=>{
        return res.status(500).json({message: error.message?error.message : "Internal server error"});
    })
}

export {registerUser};