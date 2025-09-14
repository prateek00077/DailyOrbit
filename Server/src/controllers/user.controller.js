import sendEmail from "../config/mailservice.js";
import { Category } from "../models/category.model.js";
import { Task } from "../models/task.model.js";
import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import redisService from "../services/redisService.js";

//function for user registration
const registerUser = async(req,res)=>{
    try {
        const {username, email, password, fullname} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({message: "Please fill required fields"});
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        // Check if a user already exists
        const userExists = await User.findOne({
            $or: [{username}, {email}]
        });

        if(userExists){
            console.log("This username or email is already taken");
            return res.status(400).json({message : "This username or email is already taken"});
        }

        // Check if there's a pending registration for this email in Redis
        const existingOTPData = await redisService.getOTP(email);
        
        // Generate OTP
        const otp = Math.floor(Math.random()*10000).toString().padStart(4, '0');
        
        // Prepare user data for Redis storage
        const userData = {
            username,
            fullname,
            email,
            password: bcrypt.hashSync(password, 10),
            otp
        };

        // Store or update OTP data in Redis with 10 minutes TTL
        await redisService.storeOTP(email, userData, 600); // 600 seconds = 10 minutes

        // Send email to user with the OTP
        try {
            await sendEmail(email, "Verify your email", `Your OTP is ${otp}`);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
        }

        const message = existingOTPData 
            ? "Registration updated successfully. Please verify your email." 
            : "Registration initiated. Please verify your email.";

        return res.status(200).json({
            email: email,
            message: message,
            requiresVerification: true
        })
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({message: error.message || "Internal server error"});
    }
}

//function for verifying user email through OTP
const verifyUserEmail = async ( req, res ) => {
    const { email, otp } = req.body;

    if( !email || !otp ) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        // Verify OTP using Redis service
        const verification = await redisService.verifyOTP(email, otp);

        if (!verification.valid) {
            return res.status(400).json({ message: verification.message });
        }

        const userData = verification.data;

        // Create the actual user in the database
        const newUser = new User({
            username: userData.username,
            fullname: userData.fullname,
            email: userData.email,
            password: userData.password
        });

        await newUser.save();

        // Add default category for the new user
        const defaultCategory = new Category({
            title: "General",
            description: "Default category",
            colorCode: "#4F46E5",
            userId: newUser._id,
            date: new Date(),
        });

        await defaultCategory.save();

        // Delete the OTP data from Redis (automatically expires with TTL, but we'll delete it explicitly)
        await redisService.deleteOTP(email);

        return res.status(200).json({ 
            message: "Email verified successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Error verifying user email:", error);
        return res.status(500).json({ message: "Internal server error" });
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

    // Since we removed isVerified, all users in the database are verified
    // No need to check verification status
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

    try {
        if (refreshToken) {
            await User.findOneAndUpdate({refreshToken}, {refreshToken: ""});
        }
        return res
            .clearCookie("accessToken", {
                httpOnly: true,
                secure: true
            })
            .clearCookie("refreshToken", {
                httpOnly: true,
                secure: true
            })
            .status(200)
            .json({message: "User logged out successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message?error.message : "Internal server error"});
    }
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

//function for resending OTP
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Generate new OTP
        const otp = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        
        // Update OTP in Redis with new TTL
        const updateResult = await redisService.updateOTP(email, otp, 600); // 600 seconds = 10 minutes

        if (!updateResult.success) {
            return res.status(404).json({ message: updateResult.message });
        }

        // Send new OTP email
        try {
            await sendEmail(email, "Verify your email", `Your new OTP is ${otp}`);
            return res.status(200).json({ message: "New OTP sent successfully" });
        } catch (emailError) {
            console.error("Failed to send OTP email:", emailError);
            return res.status(500).json({ message: "Failed to send OTP email" });
        }

    } catch (error) {
        console.error("Error resending OTP:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Note: Redis automatically handles TTL expiration, so no cleanup function needed

export {registerUser, loginUser, logoutUser, deleteUser, verifyUserEmail, resendOTP};