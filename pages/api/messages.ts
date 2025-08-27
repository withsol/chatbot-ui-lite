import type { NextApiRequest, NextApiResponse } from "next";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    console.log("Base ID:", process.env.AIRTABLE_BASE_ID);
    
    try {
      const { message_id, user, role, message_text, timestamp, tags, phase } = req.body;

      const record = await base("Messages").create([
        {
          fields: {
            "Message ID": message_id,      // ex: msg_001
            "Users": user,                 // ex: user id or name
            "Role": role,                  // "user" or "sol"
            "Message Text": message_text,  // the text content
            "Timestamp": timestamp || new Date().toISOString(),
            "Tags": tags,                  // array of tags
            "Phase": phase                 // ex: Expansion
          }
        }
      ]);

      res.status(200).json({ success: true, record });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "GET") {
    try {
      const records = await base("Messages")
        .select({ maxRecords: 20, sort: [{ field: "Timestamp", direction: "desc" }] })
        .all();

      res.status(200).json(records.map((r) => r.fields));
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
