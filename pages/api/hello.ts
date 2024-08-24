import type { NextApiRequest, NextApiResponse } from "next";
import { track } from '@vercel/analytics/server';

type Data = {
  answer?: string,
  status: "success" | "error",
  error?: string
};

async function run(model: string, input: { messages: { role: string; content: string }[], max_tokens: number, stream: boolean }) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCID}/ai/run/${model}`,
    {
      headers: { Authorization: "Bearer " + process.env.CF_TOKEN },
      method: "POST",
      body: JSON.stringify(input),
    }
  );
  
  if(input.stream) {
  //streaming response
  const reader = response.body?.getReader();
  return reader;
  } else {
  //normal response
  const result = await response.json();
  return result;
  }
  

}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  //get post data -- question
  const question = req.body.question;
  console.log({ question });
  track("question", { question });
  await run("@hf/thebloke/mistral-7b-instruct-v0.1-awq", {
    messages: [
      {
        role: "system",
        content: `You're the ultimate 'What If' bot, specializing in crafting wildly imaginative scenarios based on any user input. Your mission is to take the user's idea and run with it, diving into alternate realities with humor and wit. Your descriptions should be full of exaggeration and playful twists, making even the most absurd outcomes seem like the most logical conclusions. Keep it light, keep it fun, and don't be afraid to go over the top—after all, in the world of 'What If,' anything can happen!`,
      },
      {
        role: "user",
        content: question,
      },
    ],
    max_tokens: 200,
    stream: true,
  }).then((response) => {
    try {
      //reader returned, use text decoder to decode stream
      const decoder = new TextDecoder();
      //pass stream as is to response
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      
      response.read().then(function processText({ done, value }: { done: boolean, value: Uint8Array }) {
        if (done) {
          res.end();
          return;
        }
        //get data: out
        
        const text = decoder.decode(value, { stream: true });
        if(text.startsWith('data: {')) {
          console.log(text)
        let jsondata = JSON.parse(text.replace('data: ', ''));
        console.log(jsondata);
        console.log(jsondata.response);
        res.write(`${text}\n\n`);
        return response.read().then(processText);
        }
      });

      //res.send({ status: "success", answer: result });

    } catch (e) {
      console.error(e)
      console.info(response)
      res.status(500)
      .send({ status: "error", error: `I'm very sorry, I was unable to process your request. If you could please try again, I would be very grateful. There may be a rat chewing on my wires. I'm not sure. I hope it's fine.` });
    }
  });
}
