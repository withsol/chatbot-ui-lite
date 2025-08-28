import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";
import Airtable from "airtable";

export const config = {
  api: {
    bodyParser: false, // Required for formidable file parsing
  },
};

// ✅ Setup Airtable (server-side only)
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

// ✅ OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper: extract tags from Sol’s reply
async function generateTags(text: string): Promise<string[]> {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Extract 2–4 concise, lowercase tags from the text (e.g. support, visibility, resistance). Return as a JSON array of strings.",
        },
        { role: "user", content: text },
      ],
    });

    const raw = completion.choices[0].message?.content || "[]";
    return JSON.parse(raw);
  } catch (err) {
    console.error("Tag generation failed:", err);
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "File parsing failed" });
    }

    try {
      const userMessage = fields.message?.toString() || "";
      const email = fields.email?.toString() || "";
      const file = files.file?.[0];

      if (!email) {
        return res.status(400).json({ error: "Missing email" });
      }

      // 📝 Optionally process file content
      if (file) {
        const fileContent = fs.readFileSync(file.filepath, "utf-8");
        console.log("Received file:", file.originalFilename);
        // You could include `fileContent` in OpenAI context here if desired
      }

      // 🧠 Send userMessage → OpenAI
      const completion = await client.chat.completions.create({
        model: process.env.NEXT_PUBLIC_DEFAULT_MODEL || "gpt-4o",
        messages: [{ role: "user", content: userMessage }],
      });

      const solReply = completion.choices[0].message?.content || "";

      // 🏷 Generate tags for Sol’s reply
      const tags = await generateTags(solReply);

      // ✅ Log USER message
      if (userMessage) {
        await base("Messages").create([
          {
            fields: {
              Email: email,
              Role: "user",
              "Message Text": userMessage,
              Timestamp: new Date().toISOString(),
            },
          },
        ]);
      }

      // ✅ Log SOL reply (with tags)
      if (solReply) {
        await base("Messages").create([
          {
            fields: {
              Email: email,
              Role: "sol",
              "Message Text": solReply,
              Tags: tags,
              Timestamp: new Date().toISOString(),
            },
          },
        ]);
      }

      return res.status(200).json({ reply: solReply, tags });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}
