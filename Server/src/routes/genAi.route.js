import { Router } from "express";
import { generateQuote } from "../services/genaiService.js";

const genaiRouter = Router();

genaiRouter.route('/get').get(generateQuote);

export default genaiRouter;