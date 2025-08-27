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
    try {
      const userMessage = fields.message?.toString() || "";
      const email = fields.email?.toString() || "";
      const file = files.file?.[0];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: userMessage }],
      });

      const solReply = completion.choices[0].message.content;

      // 🔁 Ask GPT to generate tags for Sol's response
      const tagCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant that classifies responses using up to 4 emotionally intelligent tags (like support, visibility, resistance, reframe, empowerment, safety, etc.). Return the tags only, separated by commas." },
          { role: "user", content: solReply || "" },
        ],
      });

      const tagsText = tagCompletion.choices[0].message.content || "";
      const tags = tagsText.split(",").map((tag) => tag.trim()).filter(Boolean);

      // ✅ Log user + Sol messages
      await logToAirtable({ email, role: "user", messageText: userMessage });
      await logToAirtable({ email, role: "sol", messageText: solReply, tags });

      res.status(200).json({ reply: solReply, tags });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
