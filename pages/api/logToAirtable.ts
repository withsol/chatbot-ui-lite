import Airtable from "airtable";
import { v4 as uuidv4 } from "uuid";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID || "");

export async function logToAirtable({
  email,
  role,
  messageText,
}: {
  email: string;
  role: "user" | "sol";
  messageText: string;
}) {
  try {
    await base("Messages").create([
      {
        fields: {
          "Message ID": `msg_${uuidv4().slice(0, 6)}`, // generates unique short ID
          Email: email,
          Role: role,
          "Message Text": messageText,
          Timestamp: new Date().toISOString(),
        },
      },
    ]);
  } catch (error) {
    console.error("❌ Error logging to Airtable:", error);
  }
}
