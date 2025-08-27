import React, { useState, useEffect } from "react";

const ChatInput = ({
  onSendMessage,
}: {
  onSendMessage: (message: string, email: string) => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [email, setEmail] = useState("");

  // ✅ Avoid SSR build error: Only access localStorage in useEffect
  useEffect(() => {
    const storedEmail = localStorage.getItem("solEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleSend = () => {
    if (!email) {
      alert("Please enter your email before chatting with Sol.");
      return;
    }

    if (inputValue.trim() !== "") {
      onSendMessage(inputValue, email); // <-- pass the email along with the message
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleSaveEmail = () => {
    if (!email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }
    localStorage.setItem("solEmail", email);
    alert("Email saved! You're ready to chat.");
  };

  return (
    <div style={{ padding: "1rem", borderTop: "1px solid #ccc" }}>
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ marginBottom: "0.5rem" }}>Your email:</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{ padding: "0.5rem", width: "250px", marginRight: "0.5rem" }}
        />
        <button onClick={handleSaveEmail}>Save</button>
        <button
          onClick={() => {
            localStorage.removeItem("solEmail");
            setEmail("");
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Clear
        </button>
      </div>

      <input
        type="text"
        placeholder="Type your message to Sol..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ padding: "0.5rem", width: "75%", marginRight: "0.5rem" }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;
