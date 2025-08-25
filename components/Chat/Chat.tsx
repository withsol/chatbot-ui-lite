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

export const Chat: FC<Props> = ({ messages, loading, onSend, onReset }) => {
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);

  const handleSend = async (newMessage: Message) => {
    const updatedMessages = [...localMessages, newMessage];
    setLocalMessages(updatedMessages);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: updatedMessages,
        model: process.env.NEXT_PUBLIC_DEFAULT_MODEL || "gpt-4o",
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
    <>
      

      <div className="flex flex-col rounded-lg px-2 sm:p-4 sm:border border-neutral-300">
        {localMessages.map((message, index) => (
          <div key={index} className="my-1 sm:my-1.5">
            <ChatMessage message={message} />
          </div>
        ))}

        {loading && (
          <div className="my-1 sm:my-1.5">
            <ChatLoader />
          </div>
        )}

        <div className="mt-4 sm:mt-8 bottom-[56px] left-0 w-full">
          <ChatInput
            handleSendMessage={(text: string) =>
              handleSend({ role: "user", content: text })
            }
          />
        </div>
      </div>
    </>
  );
};
