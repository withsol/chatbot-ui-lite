import { useState } from "react";
import { Chat } from "../components/Chat/Chat";
import { Message } from "../types";

export default function Home() {
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
    <div className="min-h-screen bg-sol-background flex items-center justify-center px-4">
      {/* Contained chat box */}
      <div className="w-full max-w-3xl">
        <Chat
          messages={messages}
          loading={loading}
          onSend={handleSend}
          onReset={() => setMessages([])}
        />
      </div>
    </div>
  );
}
