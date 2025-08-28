import { base } from "./airtableClient";

interface LogMessageOptions {
  email: string;
  role: "user" | "sol";
  messageText: string;
  tags?: string[];
}

export async function logToAirtable({ email, role, messageText, tags = [] }: LogMessageOptions) {
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
