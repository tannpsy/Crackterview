// const { GoogleGenAI } = require("@google/genai");
// const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts");

import { GoogleGenAI } from "@google/genai";
import { conceptExplainPrompt, questionAnswerPrompt } from "../utils/prompts.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Generate interview questions and answers using Gemini
// @route   POST /api/ai/generate-questions
// @access  Private

export const chatWithGemini = async (req, res) => {
  try {
    const { history } = req.body;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ message: "History is required and must be an array" });
    }

    const formattedHistory = history.map((msg) => ({
      role: msg.from === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: formattedHistory,
    });

    const botReply = response.text || "Sorry, I couldn't understand that.";

    res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error("Gemini chat error:", error.message);
    res.status(500).json({ message: "Failed to chat with Gemini", error: error.message });
  }
};


export const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
    
    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
        return res.status(400).json({message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });

    let rawText = response.text;

    // Clean it: Remove json and from beginning and end
    const cleanedText = rawText
        .replace(/^```json\s*/, "") // remove starting ```json
        .replace(/```$/, "") // remove ending
        .trim(); // remove extra spaces
    
    // Now safe to parse
    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc    Generate explanation for an interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    });

    let rawText = response.text;

    // Clean it: Remove ```json and ``` from beginning and end
    const cleanedText = rawText
        .replace(/^```json\s*/, "") // remove starting ```json
        .replace(/```$/, "") // remove ending ```
        .trim(); // remove extra spaces
    
    // Now safe to parse
    const data = JSON.parse(cleanedText);
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

// module.exports = {
//   generateInterviewQuestions,
//   generateConceptExplanation,
//   chatWithGemini
// };
