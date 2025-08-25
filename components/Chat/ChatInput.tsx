"use client";

import { useState } from "react";

interface ChatInputProps {
  handleSendMessage: (message: string) => void;
}

export default function ChatInput({ handleSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;
    handleSendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-center gap-2 border border-neutral-200 bg-white rounded-full px-3 py-2 shadow-sm">
      <textarea
        className="flex-1 bg-transparent outline-none resize-none text-sol-text placeholder-gray-400"
        rows={1}
        placeholder="Type here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        onClick={sendMessage}
        className="w-9 h-9 flex items-center justify-center bg-sol-accent text-white rounded-full shadow-sm hover:bg-sol-accentHover transition-colors"
      >
        ➤
      </button>
    </div>
  );
}