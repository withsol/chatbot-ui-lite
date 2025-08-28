"use client";

import { useState } from "react";
import type { FC } from "react";
import type { Message } from "@/types";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

interface Props {
  messages: Message[];
}

export const Chat: FC<Props> = ({ messages }) => {
  const [localMessages, setLocalMessages] = useState<Message[]>(messages || []);
  const [email, setEmail] = useState<string>("");
  const [thinking, setThinking] = useState(false);

  const handleSend = async (
    message: string,
    enteredEmail: string,
    file?: File | null
  ) => {
    setEmail(enteredEmail);
    const userMessage: Message = { role: "user", content: message };
    const updatedMessages = [...localMessages, userMessage];
    setLocalMessages(updatedMessages);

    const formData = new FormData();
    formData.append("email", enteredEmail);
    formData.append("message", message); // simplified: sending latest message
    if (file) formData.append("file", file);

    setThinking(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: formData,
    });

    setThinking(false);

    if (!res.ok) {
      console.error("Failed to send message:", await res.text());
      return;
    }

    const { reply } = await res.json();

    if (reply) {
      const typingReply: Message = { role: "assistant", content: "" };
      setLocalMessages((prev) => [...prev, typingReply]);

      let currentText = "";
      for (let i = 0; i < reply.length; i++) {
        currentText += reply[i];
        await new Promise((resolve) => setTimeout(resolve, 10));
        setLocalMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...typingReply,
            content: currentText,
          };
          return updated;
        });
      }
    }
  };

  return (
    <div className="flex flex-col rounded-lg px-2 sm:p-4 sm:border border-neutral-300">
      {localMessages.map((message, index) => (
        <div key={index} className="my-1 sm:my-1.5">
          <ChatMessage
            message={message}
            isLast={index === localMessages.length - 1}
          />
        </div>
      ))}

      {thinking && (
        <div className="my-1 sm:my-1.5 animate-pulse text-center text-2xl">
          ✷
        </div>
      )}

      <div className="mt-4 sm:mt-8 bottom-[56px] left-0 w-full">
        <ChatInput onSendMessage={handleSend} />
      </div>
    </div>
  );
};
