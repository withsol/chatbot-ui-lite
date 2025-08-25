import { useState } from "react";
import { Chat } from "../components/Chat/Chat";
import { Message } from "@/types";

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

  const handleReset = () => {
    // Reset conversation and show Sol's greeting again
    setMessages([
      {
        role: "assistant",
        content:
          "Hi there, Sol here 👋 I'm here to support you in taking aligned-to-you next steps in your life and business. What's coming up for you today?",
      },
    ]);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Sol</h1>
      <Chat
        messages={messages}
        loading={loading}
        onSend={handleSend}
        onReset={handleReset}
      />
    </div>
  );
}
