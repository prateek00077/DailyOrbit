import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

connectDB();
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});