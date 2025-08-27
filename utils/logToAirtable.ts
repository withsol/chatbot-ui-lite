import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID || "");

export async function logToAirtable({
  email,
  role,
  messageText,
  tags = [],
}: {
  email: string;
  role: "user" | "sol";
  messageText: string;
  tags?: string[];
}) {
  try {
    await base("Messages").create([
      {
        fields: {
          Email: email,
          Role: role,
          "Message Text": messageText,
          Tags: tags,
        },
      },
    ]);
  } catch (err) {
    console.error("Error logging to Airtable:", err);
  }
}
