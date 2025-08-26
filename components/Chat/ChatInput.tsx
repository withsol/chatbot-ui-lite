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
    <div className="flex flex-col gap-2 px-2 py-2">
      {/* File preview above input bubble */}
      {file && (
        <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 px-3 py-2 rounded-lg shadow-sm">
          {file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="h-10 w-10 object-cover rounded"
            />
          ) : (
            <span className="text-lg">⇲</span>
          )}
          <span className="text-sm text-sol-text truncate max-w-[200px]">
            {file.name}
          </span>
          <button
            onClick={() => setFile(null)}
            className="ml-auto text-red-500 hover:text-red-700 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input bubble */}
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

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent outline-none resize-none text-sol-text placeholder-gray-400 text-base leading-snug max-h-40 overflow-y-auto"
          rows={1}
          placeholder="Type here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Send button */}
        <button
          onClick={sendMessage}
          disabled={!message.trim() && !file}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ml-2
            ${message.trim() || file
              ? "bg-sol-accent text-white hover:bg-sol-accentHover"
              : "bg-neutral-200 text-neutral-400 cursor-default"}`}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
