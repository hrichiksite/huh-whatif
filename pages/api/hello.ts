// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  answer: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  //get post data -- question
  const question = req.body.question;
  console.log({ question });
  
  res.status(200).json({ answer: "John Doe" });
}
