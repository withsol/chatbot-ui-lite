import type { NextApiRequest, NextApiResponse } from "next";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { user_id, role, content, tags } = req.body;

      const record = await base("Messages").create([
        {
          fields: {
            user_id,         // update if your Airtable column name is different
            role,
            content,
            timestamp: new Date().toISOString(),
            ...(tags ? { tags } : {})
          }
        }
      ]);

      res.status(200).json({ success: true, record });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  } else if (req.method === "GET") {
    try {
      const records = await base("Messages")
        .select({ maxRecords: 10, sort: [{ field: "timestamp", direction: "desc" }] })
        .all();

      res.status(200).json(records.map((r) => r.fields));
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
