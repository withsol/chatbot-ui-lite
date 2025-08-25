import { Message } from "@/types";
import { FC } from "react";
import ChatInput from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { ResetChat } from "./ResetChat";

----
const solSystemPrompt =
  process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
  "You are Sol, an emotionally intelligent, presence-first coach and partner. Always meet the human before moving to strategy, invite small aligned steps, and weave identity evolution into every response. Speak with warmth, clarity, and consent.";

const messagesWithSystem = [
  { role: "system", content: solSystemPrompt },
  ...messages,
];

const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: messagesWithSystem, model }),
});
----


interface Props {
  messages: Message[];
  loading: boolean;
  onSend: (message: Message) => void;
  onReset: () => void;
}

export const Chat: FC<Props> = ({ messages, loading, onSend, onReset }) => {
  return (
    <>
      <div className="flex flex-row justify-between items-center mb-4 sm:mb-8">
        <ResetChat onReset={onReset} />
      </div>

      <div className="flex flex-col rounded-lg px-2 sm:p-4 sm:border border-neutral-300">
        {messages.map((message, index) => (
          <div
            key={index}
            className="my-1 sm:my-1.5"
          >
            <ChatMessage message={message} />
          </div>
        ))}

        {loading && (
          <div className="my-1 sm:my-1.5">
            <ChatLoader />
          </div>
        )}

        <div className="mt-4 sm:mt-8 bottom-[56px] left-0 w-full">
          <ChatInput handleSendMessage={(text: string) => onSend({ role: "user", content: text })} />
        </div>
      </div>
    </>
  );
};
