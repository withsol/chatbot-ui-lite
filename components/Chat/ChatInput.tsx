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
    <div className="flex items-center px-2 py-2">
      {/* Full pill bubble with everything inside */}
      <div className="flex items-center flex-1 bg-white border border-neutral-200 rounded-full px-3 py-2 shadow-sm">
        
        {/* + button */}
        <label className="cursor-pointer text-xl text-sol-accent hover:opacity-80 transition mr-3 flex-shrink-0">
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

        {/* Message input */}
        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent outline-none resize-none text-sol-text placeholder-gray-400 text-base leading-snug max-h-40 overflow-y-auto"
          rows={1}
          placeholder="Type here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Send button inside bubble */}
        <button
          onClick={sendMessage}
  disabled={!message.trim() && !file}
  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ml-2
    ${message.trim() || file
      ? "bg-sol-accent text-white hover:bg-sol-accentHover hover:-translate-y-0.5"
      : "bg-neutral-200 text-neutral-400 cursor-default"}`}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
