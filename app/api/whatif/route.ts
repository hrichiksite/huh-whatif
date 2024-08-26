import type { NextApiRequest, NextApiResponse } from "next";
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
const openai = createOpenAI({
  baseURL: process.env.OPENAI_API_BASE || `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCID}/ai/v1`,
  apiKey: process.env.OPENAI_API_KEY || process.env.CF_TOKEN
});
// Force the route to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type Data = {
  answer?: string,
  status: "success" | "error",
  error?: string
};



export async function POST(req: Request) {
  //get post data -- question
  const {question} = await req.json();
  console.log({ question });

      //res.setHeader('Content-Encoding', 'none');

  const chatCompletion = await streamText({
    system: `You're the ultimate 'What If' bot, specializing in crafting wildly imaginative scenarios based on any user input. Your mission is to take the user's idea and run with it, diving into alternate realities with humor and wit. Your descriptions should be full of exaggeration and playful twists, making even the most absurd outcomes seem like the most logical conclusions. Keep it light, keep it fun, and don't be afraid to go over the top—after all, in the world of 'What If,' anything can happen!`,
    prompt: question,
    // messages: [
    //   {
    //     role: "system",
    //     content: `You're the ultimate 'What If' bot, specializing in crafting wildly imaginative scenarios based on any user input. Your mission is to take the user's idea and run with it, diving into alternate realities with humor and wit. Your descriptions should be full of exaggeration and playful twists, making even the most absurd outcomes seem like the most logical conclusions. Keep it light, keep it fun, and don't be afraid to go over the top—after all, in the world of 'What If,' anything can happen!`,
    //   },
    //   {
    //     role: "user",
    //     content: question,
    //   },
    // ],
    model: openai("@hf/thebloke/mistral-7b-instruct-v0.1-awq"),
    maxTokens: 20,
   });

   return chatCompletion.toDataStreamResponse();

  //  //convert this to a stream
  //  let stream;
  //  //make
  //  for await (const chunk of chatCompletion) {
  //   let nextword = chunk.choices[0]?.delta?.content
  //   res.write(`data: ${JSON.stringify({nextword})}\n\n`);
  //   console.log(res.writable)
  //   process.stdout.write(chunk.choices[0]?.delta?.content || '');
  // }

  //     res.write(`data: [DONE]\n\n`);
  //     // End the response
  //     res.end();
}
