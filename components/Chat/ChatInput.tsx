"use client";

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  handleSendMessage: (message: string) => void;
}

export default function ChatInput({ handleSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = () => {
    if (!message.trim() && files.length === 0) return;

    // For now, just log files
    if (files.length > 0) {
      files.forEach((file) => {
        console.log("Sending file:", file.name);
      });
    }

    handleSendMessage(
      message ||
        `[Files sent: ${files.map((f) => f.name).join(", ")}]`
    );

    setMessage("");
    setFiles([]);
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
      {/* File previews above input */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 px-3 py-2 rounded-lg shadow-sm"
            >
              {/* Thumbnail if image */}
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-10 w-10 object-cover rounded"
                />
              ) : file.type.startsWith("audio/") ? (
                <audio
                  controls
                  src={URL.createObjectURL(file)}
                  className="h-8"
                />
              ) : (
                <span className="text-lg">✷</span>
              )}

              {/* File name */}
              <span className="text-sm text-sol-text truncate max-w-[200px]">
                {file.name}
              </span>

              {/* Remove button */}
              <button
                onClick={() =>
                  setFiles(files.filter((_, i) => i !== index))
                }
                className="ml-auto text-red-500 hover:text-red-700 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
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
            multiple
            accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
            onChange={(e) => {
              const selected = Array.from(e.target.files || []);
              setFiles((prev) => [...prev, ...selected]);
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
          disabled={!message.trim() && files.length === 0}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ml-2
            ${message.trim() || files.length > 0
              ? "bg-sol-accent text-white hover:bg-sol-accentHover"
              : "bg-neutral-200 text-neutral-400 cursor-default"}`}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
