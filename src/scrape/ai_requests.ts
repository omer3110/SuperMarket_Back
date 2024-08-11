import OpenAI from "openai";
require("dotenv").config();

const openaiClient = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

export async function chat() {
  try {
    const chatCompeltion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "What will be the date in 2 days from now?" },
      ],
    });
    return chatCompeltion;
  } catch (error: any) {
    if (error.message.includes("exceeded your current quota")) {
      console.error(
        "Quota exceeded. Please check your plan and billing details."
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
}
