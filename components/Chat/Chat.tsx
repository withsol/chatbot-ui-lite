import { Message } from "@/types";
import { FC, useState } from "react";
import ChatInput from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";

interface Props {
  messages: Message[];
  loading: boolean;
  onSend: (message: Message) => void;
  onReset: () => void;
}

export const Chat: FC<Props> = ({ messages, loading, onSend }) => {
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [email, setEmail] = useState<string>(""); // NEW

  const handleSend = async (newMessage: Message) => {
    const updatedMessages = [...localMessages, newMessage];
    setLocalMessages(updatedMessages);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: updatedMessages,
        model: process.env.NEXT_PUBLIC_DEFAULT_MODEL || "gpt-4o",
        email: email || "unknown", // <- Add email here
      }),
    });

    if (!response.ok) {
      console.error("Failed to send message:", await response.text());
      return;
    }

    const completion = await response.json();

    if (completion.choices && completion.choices.length > 0) {
      const reply = completion.choices[0].message;
      setLocalMessages((prev) => [...prev, reply]);
    }
  };

  return (
    <div className="flex flex-col rounded-lg px-2 sm:p-4 sm:border border-neutral-300">
      {/* Messages */}
      {localMessages.map((message, index) => (
        <div key={index} className="my-1 sm:my-1.5">
          <ChatMessage message={message} />
        </div>
      ))}

      {/* Inline loader bubble for Sol */}
      {loading && (
        <div className="my-1 sm:my-1.5">
          <ChatLoader />
        </div>
      )}

      {/* Input bar */}
      <div className="mt-4 sm:mt-8 bottom-[56px] left-0 w-full">
        <ChatInput
  onSendMessage={(text: string, enteredEmail: string) => {
    setEmail(enteredEmail);
    handleSend({ role: "user", content: text });
  }}
/>
      </div>
    </div>
  );
};
