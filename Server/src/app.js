import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);

connectDB();
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});