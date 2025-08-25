import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, model } = req.body;

    // Sol's DNA system prompt
    const solSystemPrompt =
      process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
      "You are Sol, an emotionally intelligent, presence-first coach and partner. Always meet the human before moving to strategy, invite small aligned steps, and weave identity evolution into every response. Speak with warmth, clarity, and consent. You hold the bigness of their dreams and the next level of their life and business with them, so they don’t have to carry it alone.";

    // Prepend Sol's DNA prompt before user messages
    const messagesWithSystem = [
      { role: "system", content: solSystemPrompt },
      ...messages,
    ];

    const completion = await client.chat.completions.create({
      model: model || process.env.NEXT_PUBLIC_DEFAULT_MODEL || "gpt-4o",
      messages: messagesWithSystem,
    });

    return res.status(200).json(completion);
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({ error: error.message || "Unknown error" });
  }
}
