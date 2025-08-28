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

  const handleSend = async (text: string, email: string, file?: File | null) => {
    const userMessage: Message = { role: "user", content: text, email };
    setMessages((prev) => [...prev, userMessage]);

    // Prepare request
    const formData = new FormData();
    formData.append("email", email);
    formData.append("message", text);
    if (file) formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      setLoading(false);

      if (!res.ok) {
        console.error("Failed to send message:", await res.text());
        return;
      }

      const { reply } = await res.json();

      if (reply) {
        // Fake typing effect
        const typingReply: Message = { role: "assistant", content: "" };
        setMessages((prev) => [...prev, typingReply]);

        let currentText = "";
        for (let i = 0; i < reply.length; i++) {
          currentText += reply[i];
          await new Promise((resolve) => setTimeout(resolve, 10));
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...typingReply,
              content: currentText,
            };
            return updated;
          });
        }
      }
    } catch (err) {
      console.error("Error calling /api/chat:", err);
      setLoading(false);
    }
  };

  const handleReset = () => setMessages([]);

  return (
    <div className="min-h-screen bg-sol-background flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <Chat
          messages={messages}
          loading={loading}
          onSend={handleSend}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
