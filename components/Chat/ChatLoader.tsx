import { useEffect, useState } from "react";

export const ChatLoader = () => {
  const [isVisible, setIsVisible] = useState(true);

  // When this component unmounts (reply starts), trigger fade-out
  useEffect(() => {
    return () => {
      setIsVisible(false);
    };
  }, []);

  return (
    <div
      className={`flex justify-start my-2 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-[80%] px-4 py-3 rounded-lg shadow-sm bg-sol-bubble text-sol-accent flex items-center">
        <div className="text-xl animate-solPulse">✷</div>
      </div>
    </div>
  );
};
