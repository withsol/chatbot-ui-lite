import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { OpenAI } from "openai";
import { logToAirtable } from "../../utils/logToAirtable";

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
    try {
      const userMessage = fields.message?.toString() || "";
      const email = fields.email?.toString() || "";
      const file = files.file?.[0];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: userMessage }],
      });

      const solReply = completion.choices[0].message.content || "";

      // Use GPT to generate tags based on the Sol reply
      const tagResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Given a coaching response, return 2–4 simple lowercase tags that describe its emotional tone or purpose. Use only one word per tag (e.g. support, clarity, visibility, reframe, truth, pattern, expansion)." },
          { role: "user", content: solReply },
        ],
      });

      const tagText = tagResponse.choices[0].message.content || "";
      const tags = tagText
        .split(/[\n,]+/)
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => !!tag && tag.length < 30);

      // Log user + Sol messages to Airtable
      await logToAirtable({ email, role: "user", messageText: userMessage });
      await logToAirtable({ email, role: "sol", messageText: solReply, tags });

      res.status(200).json({ reply: solReply });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
