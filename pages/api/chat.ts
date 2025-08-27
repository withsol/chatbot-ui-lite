import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import Airtable from "airtable";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, model } = req.body;

    const solSystemPrompt =
      process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
      "You are Sol, an emotionally intelligent, presence-first coach and partner...";

    const messagesWithSystem = [
      { role: "system", content: solSystemPrompt },
      ...messages,
    ];

    // Call OpenAI
    const completion = await client.chat.completions.create({
      model: model || process.env.NEXT_PUBLIC_DEFAULT_MODEL || "gpt-4o",
      messages: messagesWithSystem,
    });

    const solReply = completion.choices[0].message?.content || "";
    const userMessage = messages[messages.length - 1]?.content || "";

    // --- Airtable Logging: ONLY Message Text ---
    if (userMessage) {
      base("Messages")
        .create([
          {
            fields: {
              "Message Text": userMessage,
            },
          },
        ])
        .catch((err) => console.error("Airtable log error (user):", err));
    }

    if (solReply) {
      base("Messages")
        .create([
          {
            fields: {
              "Message Text": solReply,
            },
          },
        ])
        .catch((err) => console.error("Airtable log error (sol):", err));
    }
    // --- End Test Logger ---

    return res.status(200).json(completion);
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({ error: error.message || "Unknown error" });
  }
}
