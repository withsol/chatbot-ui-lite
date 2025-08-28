import { Message } from "@/types";
import type { FC } from "react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  message: Message;
  isLast?: boolean;
}

export const ChatMessage: FC<Props> = ({ message, isLast }) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  // Typing animation for assistant
  const [displayedText, setDisplayedText] = useState(
    isUser ? message.content : ""
  );

  useEffect(() => {
    if (isAssistant) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(message.content.slice(0, i));
        i++;
        if (i > message.content.length) clearInterval(interval);
      }, 5); // ms per character
      return () => clearInterval(interval);
    }
  }, [isAssistant, message.content]);

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} my-2 animate-fadeInUp ${
        isLast ? "border border-neutral-300 rounded-lg" : ""
      }`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-lg shadow-sm transition-all duration-300 ${
          isUser
            ? "bg-sol-accent text-white font-medium"
            : "bg-sol-bubble text-sol-text"
        }`}
      >
        {!isUser && (
          <div className="text-xs font-semibold text-sol-subtext mb-1">Sol</div>
        )}
        <div className="prose prose-sm max-w-none leading-relaxed">
          <ReactMarkdown>
            {isUser ? message.content : displayedText}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
