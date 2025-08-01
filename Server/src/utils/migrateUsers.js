import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const migrateUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for migration");

        // Find all users with isVerified field
        const usersWithIsVerified = await User.find({ isVerified: { $exists: true } });
        
        if (usersWithIsVerified.length === 0) {
            console.log("No users with isVerified field found. Migration not needed.");
            return;
        }

        console.log(`Found ${usersWithIsVerified.length} users with isVerified field`);

        // Remove isVerified and otp fields from all users
        const result = await User.updateMany(
            {},
            { 
                $unset: { 
                    isVerified: "", 
                    otp: "" 
                } 
            }
        );

        console.log(`Successfully migrated ${result.modifiedCount} users`);
        console.log("Migration completed successfully");

    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    migrateUsers();
}

export default migrateUsers; 