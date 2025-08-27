import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Message } from "ai/react";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import Airtable from "airtable";

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Form parse error" });
    }

    try {
      // ✅ Safely extract fields
      const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
      const model = Array.isArray(fields.model) ? fields.model[0] : fields.model;
      const rawMessages = Array.isArray(fields.messages) ? fields.messages[0] : fields.messages;
      const messages = JSON.parse(rawMessages || "[]") as Message[];

      if (!email) {
        return res.status(400).json({ error: "Missing email." });
      }

      // ✅ Validate email exists in Users table
      const matchingUsers = await base("Users")
        .select({
          filterByFormula: `{Email} = '${email}'`,
          maxRecords: 1,
        })
        .firstPage();

      if (matchingUsers.length === 0) {
        return res.status(403).json({ error: "Unrecognized email address." });
      }

      const userId = matchingUsers[0].id;

      // ✅ Log user message
      const userMessage = messages[messages.length - 1]?.content || "";
      if (userMessage) {
        base("Messages")
          .create([
            {
              fields: {
                "Message Text": userMessage,
                "Role": "user",
                "Email": [userId],
                "Timestamp": new Date().toISOString(),
              },
            },
          ])
          .catch((err) => console.error("Airtable log error (user):", err));
      }

      // ✅ Log file metadata if uploaded
      const uploadedFile = files.file?.[0];
      if (uploadedFile) {
        console.log(`Uploaded file received: ${uploadedFile.originalFilename}`);
        base("Messages")
          .create([
            {
              fields: {
                "Message Text": `📎 File uploaded: ${uploadedFile.originalFilename}`,
                "Role": "user",
                "Email": [userId],
                "Timestamp": new Date().toISOString(),
              },
            },
          ])
          .catch((err) => console.error("Airtable log error (file):", err));
      }

      // ✅ Send to OpenAI
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: model || "gpt-4o",
          messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return res.status(500).json({ error });
      }

      // ✅ Log Sol reply after it streams
      const stream = OpenAIStream(response, {
        onCompletion: async (solReply: string) => {
          base("Messages")
            .create([
              {
                fields: {
                  "Message Text": solReply,
                  "Role": "sol",
                  "Email": [userId],
                  "Timestamp": new Date().toISOString(),
                },
              },
            ])
            .catch((err) => console.error("Airtable log error (sol):", err));
        },
      });

      return new StreamingTextResponse(stream);
    } catch (error: any) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}
