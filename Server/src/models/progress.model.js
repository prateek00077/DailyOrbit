import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        completedTasks: {
            type: Number,
            default: 0,
        },
        totalTasks: {
            type: Number,
            default: 0,
        }
    },
    { timestamps: true }
);

export const Progress = mongoose.model('Progress', progressSchema);