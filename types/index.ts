export type MessageRole = "user" | "assistant" | "system";

export type Message = {
  id?: string; // Optional: assigned later if stored in DB
  role: MessageRole;
  content: string;

  // Optional fields to support Sol + Lore
  createdAt?: string; // ISO timestamp
  tags?: string[]; // e.g. ["visibility", "support"]
  summary?: string; // auto-generated TL;DR
  fileUrl?: string; // if user uploads a file
  email?: string; // to track who said what
  conversationId?: string; // if you’re threading or grouping chats

  // Optional prompt-specific metadata
  promptMeta?: {
    tone?: string;
    model?: string;
    purpose?: string; // e.g. "visibility support", "content generation"
    responseType?: "strategy" | "reflection" | "coaching";
  };
};
