import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";


// Initialize the client.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuote(req, res) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = "Generate a short, powerful motivational quote. Make it unique and inspiring. Maximum 20 words.";

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log("Generated Quote:", text);
    res.json({ quote: text });

  } catch (error) {
    // If an error still occurs, it will be a more specific authentication or API issue.
    console.error("ERROR IN generateQuote:", error);
    res.status(500).json({ error: "Failed to generate quote." });
  }
}

export { generateQuote };

