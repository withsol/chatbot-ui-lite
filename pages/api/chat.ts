import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import formidable from "formidable";
import { logToAirtable } from "@/utils/logToAirtable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(400).json({ error: "Failed to parse form data." });
    }

    try {
      const userMessage = fields.message?.toString() || "";
      const email = fields.email?.toString() || "";
      const file = files?.file?.[0];

      // Send user message to OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: userMessage }],
      });

      const solReply = completion.choices?.[0]?.message?.content || "";

      // Log both messages to Airtable
      await logToAirtable({ email, role: "user", messageText: userMessage });
      await logToAirtable({ email, role: "sol", messageText: solReply });

      // Return reply
      res.status(200).json({ reply: solReply });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
