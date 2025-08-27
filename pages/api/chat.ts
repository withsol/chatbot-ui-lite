import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import Airtable from "airtable";

// OpenAI Client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Airtable Client
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID as string);

// Helper: Check if email exists in Airtable "Users" table
async function isEmailValid(email: string): Promise<boolean> {
  const records = await base("Users")
    .select({
      filterByFormula: `{Email} = '${email}'`,
      maxRecords: 1,
    })
    .firstPage();

  return records.length > 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, model, email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Missing or invalid email." });
    }

    const emailIsValid = await isEmailValid(email);
    if (!emailIsValid) {
      return res.status(403).json({ error: "Unrecognized email address." });
    }

    const solSystemPrompt =
      process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
      "You are Sol, an emotionally intelligent, presence-first coach and partner...";

    const messagesWithSystem = [
      { role: "system", content: solSystemPrompt },
      ...messages,
    ];

    // OpenAI Chat Completion
    const completion = await client.chat.completions.create({
      model: model || process.env.NEXT_PUBLIC_DEFAULT_MODEL || "gpt-4o",
      messages: messagesWithSystem,
    });

    const solReply = completion.choices[0].message?.content || "";
    const userMessage = messages[messages.length - 1]?.content || "";

    // Log USER message to Airtable
    if (userMessage) {
      base("Messages")
        .create([
          {
            fields: {
              "Message Text": userMessage,
              "Role": "user",
              "Email": [email],
              "Timestamp": new Date().toISOString(),
            },
          },
        ])
        .catch((err) => console.error("Airtable log error (user):", err));
    }

    // Log SOL reply to Airtable
    if (solReply) {
      base("Messages")
        .create([
          {
            fields: {
              "Message Text": solReply,
              "Role": "sol",
              "Email": [email],
              "Timestamp": new Date().toISOString(),
            },
          },
        ])
        .catch((err) => console.error("Airtable log error (sol):", err));
    }

    return res.status(200).json(completion);
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({ error: error.message || "Unknown error" });
  }
}
