import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        title : {
            type: String,
            required: true,
        },
        description : {
            type: String,
        },
        userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User",
            required: true
        },
        colorCode : {
            type: String,
            default: "#000000"
        },
        date : {
            type: Date,
            default: Date.now
        },
    },
    { timestamps: true , toJSON: { virtuals: true }, toObject: { virtuals: true }}
);

categorySchema.index({ title: 1, userId: 1 }, { unique: true });

export const Category = mongoose.model("Category", categorySchema);