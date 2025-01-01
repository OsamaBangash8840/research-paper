import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request, res: Response) {
  const reqBody = await req.json();
  const prompt = reqBody.data.prompt;

  // for Groq. Get your api-key and save it in .env file with GROQ_API_KEY name
  const openai = createOpenAI({
    baseURL:'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY
  });

  const result = await streamText({
    model: openai('llama-3.1-70b-versatile'),
    prompt: prompt
  });

  
  return result.toDataStreamResponse();
}
