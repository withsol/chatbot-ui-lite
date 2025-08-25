"use client";

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  handleSendMessage: (message: string) => void;
}

export default function ChatInput({ handleSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = () => {
    if (!message.trim() && !file) return;
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="flex items-end gap-2 px-2 py-2">
      {/* Full rounded container */}
      <div className="flex items-center flex-1 bg-white border border-neutral-200 rounded-full px-3 py-2 shadow-sm">
        {/* + attachment button */}
        <label className="cursor-pointer text-lg text-sol-subtext hover:text-sol-accent transition flex-shrink-0 mr-2">
          +
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) setFile(selected);
            }}
          />
        </label>

        {/* Message box (auto-grow textarea) */}
        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent outline-none resize-none text-sol-text placeholder-gray-400 text-base leading-snug max-h-40 overflow-y-auto"
          rows={1}
          placeholder="Type here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Send button (active only when typing) */}
      <button
        onClick={sendMessage}
        disabled={!message.trim() && !file}
        className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors
          ${message.trim() || file
            ? "bg-sol-accent text-white hover:bg-sol-accentHover"
            : "bg-neutral-200 text-neutral-400 cursor-default"}`}
      >
        ➤
      </button>
    </div>
  );
}
