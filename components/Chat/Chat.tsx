// Updated Chat.tsx with fake streaming and ✷ thinking indicator


import type { NextApiRequest, NextApiResponse } from "next";
import { useState, useEffect } from "react";
import { Message } from "ai/react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { ChatLoader } from "./ChatLoader";


interface Props {
messages: Message[];
loading: boolean;
onSend: (message: Message) => void;
onReset: () => void;
}


export const Chat: FC<Props> = ({ messages, loading }) => {
const [localMessages, setLocalMessages] = useState<Message[]>(messages);
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
formData.append("model", process.env.NEXT_PUBLIC_DEFAULT_MODEL || "gpt-4o");
formData.append("messages", JSON.stringify(updatedMessages));
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


const completion = await res.json();
const reply = completion.choices[0]?.message;


if (reply) {
const typingReply: Message = { role: "assistant", content: "" };
setLocalMessages((prev) => [...prev, typingReply]);


let currentText = "";
for (let i = 0; i < reply.content.length; i++) {
currentText += reply.content[i];
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
<ChatMessage message={message} isLast={index === localMessages.length - 1} />
</div>
))}


{thinking && (
<div className="my-1 sm:my-1.5 animate-pulse text-center text-2xl">✷</div>
)}


<div className="mt-4 sm:mt-8 bottom-[56px] left-0 w-full">
<ChatInput onSendMessage={handleSend} />
</div>
</div>
);
};