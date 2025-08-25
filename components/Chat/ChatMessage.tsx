import { Message } from "@/types";
import { FC } from "react";

interface Props {
  message: Message;
}

export const ChatMessage: FC<Props> = ({ message }) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } my-1 sm:my-1.5`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {/* Role label */}
        {!isUser && (
          <div className="text-xs font-bold mb-1 text-gray-600">
            {isAssistant ? "Sol" : message.role}
          </div>
        )}

        {/* Message content */}
        <div>{message.content}</div>
      </div>
    </div>
  );
};
