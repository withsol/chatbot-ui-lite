"use client";

import type { FC } from "react";
import type { Message } from "@/types";
import ChatInput from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

interface Props {
  messages: Message[];
  loading: boolean;
  onSend: (message: string, email: string, file?: File | null) => void;
  onReset: () => void;
}

export const Chat: FC<Props> = ({ messages, loading, onSend, onReset }) => {
  return (
    <div className="flex flex-col rounded-lg px-2 sm:p-4 sm:border border-neutral-300">
      {/* Render messages */}
      {messages.map((message, index) => (
        <div key={index} className="my-1 sm:my-1.5">
          <ChatMessage
            message={message}
            isLast={index === messages.length - 1}
          />
        </div>
      ))}

      {/* Thinking indicator */}
      {loading && (
        <div className="my-1 sm:my-1.5 animate-pulse text-center text-2xl">
          ✷
        </div>
      )}

      {/* Input */}
      <div className="mt-4 sm:mt-8 bottom-[56px] left-0 w-full">
        <ChatInput onSendMessage={onSend} />
        <button
          onClick={onReset}
          className="mt-2 text-sm text-neutral-500 hover:text-neutral-800"
        >
          Reset conversation
        </button>
      </div>
    </div>
  );
};
