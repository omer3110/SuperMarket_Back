"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = chat;
const openai_1 = __importDefault(require("openai"));
require("dotenv").config();
const openaiClient = new openai_1.default({ apiKey: process.env.OPEN_AI_API_KEY });
async function chat() {
    try {
        const chatCompeltion = await openaiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "What will be the date in 2 days from now?" },
            ],
        });
        return chatCompeltion;
    }
    catch (error) {
        if (error.message.includes("exceeded your current quota")) {
            console.error("Quota exceeded. Please check your plan and billing details.");
        }
        else {
            console.error("An unexpected error occurred:", error);
        }
    }
}
