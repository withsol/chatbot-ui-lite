import type { NextApiRequest, NextApiResponse } from "next";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const {
        name_of_lesson,
        category,
        description,
        lesson_content,
        thrivecart_learn,
        use_cases,
        emotional_state_tags,
        supporting_prompts,
        linked_transcripts,
      } = req.body;

      const record = await base("Aligned Business Method").create([
        {
          fields: {
            "Name of Lesson": name_of_lesson,
            "Category": category,
            "Description": description,
            "Lesson Content": lesson_content,
            "Thrivecart Learn": thrivecart_learn,
            "Use Cases": use_cases,
            "Emotional State Tags": emotional_state_tags,
            "Supporting Prompts": supporting_prompts,
            "Linked Transcripts": linked_transcripts,
          },
        },
      ]);

      res.status(200).json({ success: true, record });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "GET") {
    try {
      const records = await base("Aligned Business Method")
        .select({ maxRecords: 20, sort: [{ field: "Name of Lesson", direction: "asc" }] })
        .all();

      res.status(200).json(records.map((r) => r.fields));
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
