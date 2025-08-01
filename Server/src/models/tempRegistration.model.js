import mongoose from "mongoose";

const tempRegistrationSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: function() {
                return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
            }
        }
    },
    { timestamps: true }
);

// Index for automatic cleanup of expired registrations
tempRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TempRegistration = mongoose.model("TempRegistration", tempRegistrationSchema); 