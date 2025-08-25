"use client";

import { useState } from "react";

interface ChatInputProps {
  handleSendMessage: (message: string) => void;
}

export default function ChatInput({ handleSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const sendMessage = () => {
    if (!message.trim() && !file) return;

    if (file) {
      console.log("Sending file:", file.name);
    }

    handleSendMessage(message || `[File sent: ${file?.name}]`);
    setMessage("");
    setFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col gap-2 border border-neutral-200 bg-white rounded-xl px-3 py-2 shadow-sm">
      {/* Animated file preview */}
      {file && (
        <div className="flex items-center gap-2 bg-sol-bubble text-sol-text px-2 py-1 rounded-md text-sm animate-fadeInUp">
          📎 {file.name}
          <button
            className="ml-auto text-sol-subtext hover:text-red-500 transition"
            onClick={() => setFile(null)}
          >
            ❌
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* File input (paperclip icon) */}
        <label className="cursor-pointer text-lg text-sol-subtext hover:text-sol-accent transition">
          📎
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                setFile(selected);
                console.log("Uploaded file:", selected.name);
              }
            }}
          />
        </label>

        {/* Textarea */}
        <textarea
          className="flex-1 bg-transparent outline-none resize-none text-sol-text placeholder-gray-400"
          rows={1}
          placeholder="Type here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Send button */}
        <button
          onClick={sendMessage}
          className="w-9 h-9 flex items-center justify-center bg-sol-accent text-white rounded-full shadow-sm hover:bg-sol-accentHover transition-colors"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
