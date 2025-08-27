import { FC, useState } from "react";
import { Message } from "ai/react";
import ChatInput from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";

interface Props {
  messages: Message[];
  loading: boolean;
  onSend: (message: Message) => void;
  onReset: () => void;
}

export const Chat: FC<Props> = ({ messages, loading }) => {
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [email, setEmail] = useState<string>("");

  const handleSend = async (
    message: string,
    enteredEmail: string,
    file?: File | null
  ) => {
    setEmail(enteredEmail);

    const userMessage: Message = { role: "user", content: message };
    const updatedMessages = [...localMessages, userMessage];
    setLocalMessages(updatedMessages);

    // Build FormData for sending text, email, and file
    const formData = new FormData();
    formData.append("email", enteredEmail);
    formData.append("model", process.env.NEXT_PUBLIC_DEFAULT_MODEL || "gpt-4o");
    formData.append("messages", JSON.stringify(updatedMessages));
    if (file) formData.append("file", file);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error("Failed to send message:", await res.text());
      return;
    }

    const completion = await res.json();
    const reply = completion.choices?.[0]?.message;
    if (reply) {
      setLocalMessages((prev) => [...prev, reply]);
    }
  };

  return (
    <div className="flex flex-col rounded-lg px-2 sm:p-4 sm:border border-neutral-300">
      {/* Message list */}
      {localMessages.map((message, index) => (
        <div key={index} className="my-1 sm:my-1.5">
          <ChatMessage message={message} />
        </div>
      ))}

      {/* Loader bubble for Sol typing */}
      {loading && (
        <div className="my-1 sm:my-1.5">
          <ChatLoader />
        </div>
      )}

      {/* Input bar */}
      <div className="mt-4 sm:mt-8 bottom-[56px] left-0 w-full">
        <ChatInput onSendMessage={handleSend} />
      </div>
    </div>
  );
};
