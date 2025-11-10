// components/ChatBubble.tsx
import React from "react";

const ChatBubble: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className = "",
  children,
}) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        viewBox="0 0 500 350"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Bubble outline */}
        <path
          d="M75 60
             C30 120, 30 240, 90 300
             C150 340, 310 350, 420 320
             C470 290, 500 190, 470 110
             C440 40, 330 10, 210 25
             C140 30, 90 35, 75 60
             Z
             M330 320
             C340 330, 360 345, 410 350
             C370 335, 350 315, 345 300
             Z"
          fill="white"
          stroke="black"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>

      {/* Inner text area */}
      <div className="absolute inset-0 flex items-center justify-center text-xl font-medium text-black px-8 text-center">
        {children}
      </div>
    </div>
  );
};

export default ChatBubble;
