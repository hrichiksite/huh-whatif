import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  answer?: string,
  status: "success" | "error",
  error?: string
};

async function run(model: string, input: { messages: { role: string; content: string }[] }) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCID}/ai/run/${model}`,
    {
      headers: { Authorization: "Bearer " + process.env.CF_TOKEN },
      method: "POST",
      body: JSON.stringify(input),
    }
  );
  const result = await response.json();
  return result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  //get post data -- question
  const question = req.body.question;
  console.log({ question });
  await run("@hf/thebloke/mistral-7b-instruct-v0.1-awq", {
    messages: [
      {
        role: "system",
        content: `You're a 'what if' bot. You can generate 'what if' scenarios based on user input with humor and wit.
        Describe the drastic effects of it while keeping it fun and humorous.`,
      },
      {
        role: "user",
        content: question,
      },
    ],
  }).then((response) => {
    try {
      const result = response.result.response

      res.send({ status: "success", answer: result });

    } catch (e) {
      console.error(e)
      console.info(response)
      res.status(500)
      .send({ status: "error", error: `I'm very sorry, I was unable to process your request. If you could please try again, I would be very grateful. There may be a rat chewing on my wires. I'm not sure. I hope it's fine.` });
    }
  });
}
