import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyToken = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

        if(!token) return res.status(400).json("Unauthorized token");

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user) return res.status(400).json("Invalid access token");
        req.user = user ;
        next()
    } catch (error) {
        console.log("token verification error: ", error.message);
        throw new Error("Invalid access token");
    }
};

export default verifyToken;