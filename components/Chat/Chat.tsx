import { Message } from "@/types";
import { FC } from "react";
import ChatInput from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { ResetChat } from "./ResetChat";



interface Props {
  messages: Message[];
  loading: boolean;
  
  onSend: (message: Message) => const onSend = async (newMessage: Message) => {
  const updatedMessages = [...messages, newMessage];

  // Sol's DNA system prompt
  const solSystemPrompt =
    process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
    "You are Sol, an emotionally intelligent, presence-first coach and partner. Always meet the human before moving to strategy, invite small aligned steps, and weave identity evolution into every response. Speak with warmth, clarity, and consent. You hold the bigness of their dreams and the next level of their life and business with them, so they don’t have to carry it alone.";

  // Always prepend Sol’s DNA prompt
  const messagesWithSystem = [
    { role: "system", content: solSystemPrompt },
    ...updatedMessages,
  ];

  setMessages(updatedMessages);

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messagesWithSystem,
      model: model || process.env.NEXT_PUBLIC_DEFAULT_MODEL || "gpt-4o",
    }),
  });

  if (!response.ok) {
    console.error("Failed to send message:", await response.text());
    return;
  }

  const completion = await response.json();

  if (completion.choices && completion.choices.length > 0) {
    const reply = completion.choices[0].message;
    setMessages((prev
;
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
