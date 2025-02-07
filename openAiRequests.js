import { config } from "dotenv";
import OpenAI from "openai";

config();
const openAIKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: openAIKey });

export const makeGptSearchRequest = async (gptSystemPrompt, searchString) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: gptSystemPrompt,
      },
      {
        role: "user",
        content: searchString,
      },
    ],
    model: "gpt-4o-2024-08-06",
  });
  return completion.choices[0];
};
