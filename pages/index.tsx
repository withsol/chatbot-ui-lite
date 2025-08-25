import { useState } from "react";
import { Chat } from "../components/Chat/Chat";
import { Message } from "../types";

export default function Home() {
  // Start with Sol's greeting
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there, Sol here 👋 I'm here to support you in taking aligned-to-you next steps in your life and business. What's coming up for you today?",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleSend = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="p-4">
      <Chat
        messages={messages}
        loading={loading}
        onSend={handleSend}
        onReset={() => setMessages([])} // still required by Chat.tsx but hidden in UI
      />
    </div>
  );
}
