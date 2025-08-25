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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      // Dynamically import pdfjs to avoid bloating initial bundle
      const pdfjsLib = await import("pdfjs-dist/build/pdf");
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");
      // @ts-ignore
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

      const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((s: any) => s.str).join(" ") + "\n";
      }

      handleSendMessage(`File uploaded: ${file.name}\n\n${text}`);
    } else {
      // Default: treat as plain text
      const text = await file.text();
      handleSendMessage(`File uploaded: ${file.name}\n\n${text}`);
    }

    // Reset input so same file can be uploaded again if needed
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-2 p-2 border-t border-gray-300">
      {/* File Upload */}
      <input
        type="file"
        accept=".txt,.pdf"
        onChange={handleFileUpload}
        className="text-sm"
      />

      {/* Text Input */}
      <textarea
        className="flex-1 p-2 border rounded resize-none"
        rows={1}
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Send Button */}
      <button
        onClick={sendMessage}
        className="px-3 py-2 bg-blue-500 text-white rounded"
      >
        ➤
      </button>
    </div>
  );
}