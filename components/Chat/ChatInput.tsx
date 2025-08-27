import React, { useState, useEffect, ChangeEvent } from "react";

type Props = {
  onSendMessage: (message: string, email: string, file?: File | null) => void;
};

const ChatInput: React.FC<Props> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("solEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleSend = () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email before chatting with Sol.");
      return;
    }

    if (inputValue.trim() !== "" || file) {
      onSendMessage(inputValue.trim(), email, file);
      setInputValue("");
      setFile(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  return (
    <div className="w-full border-t border-neutral-300 px-2 py-4 sm:px-4">
      {/* Email row */}
      <div className="mb-4 flex items-center space-x-2">
        <label className="text-sm font-medium">Your email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-64 rounded border px-2 py-1"
        />
        <button
          onClick={() => {
            if (!email.includes("@")) return alert("Invalid email");
            localStorage.setItem("solEmail", email);
            alert("Email saved! ✅");
          }}
          className="rounded bg-blue-500 px-3 py-1 text-white"
        >
          Save
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("solEmail");
            setEmail("");
          }}
          className="rounded bg-gray-300 px-3 py-1 text-sm"
        >
          Clear
        </button>
      </div>

      {/* File upload */}
      <div className="mb-4">
        <input type="file" onChange={handleFileChange} className="text-sm" />
        {file && <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>}
      </div>

      {/* Message + Send button */}
      <div className="flex flex-row items-center gap-2">
        <input
          type="text"
          placeholder="Type your message to Sol..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow rounded border px-3 py-2"
        />
        <button
          onClick={handleSend}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
