"use client";
import dynamic from "next/dynamic";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });
import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";

function InputLoadMessages() {
  const [emoji, setEmoji] = useState(true);
  const [loading, setLoading] = useState(true);
  
  return (
    <div className="relative">
      <div className={`bg-gray-200 p-2 mt-2 rounded-md`}>
        <div className="flex items-center gap-4 pr-2 ">
          <textarea
            placeholder="Enter your message here..."
            className="flex-1 border-2 bg-white border-gray-300 rounded-lg p-2 focus:outline-none transition duration-300"
            disabled
          />
          <button
            disabled
            className="bg-indigo-600/50 text-white px-4 py-2 rounded-lg cursor-not-allowed"
          >
            Send
          </button>
          <div
            onClick={() => {
              setEmoji(!emoji);
            }}
            className="cursor-pointer text-2xl text-gray-500"
          >
            <BsEmojiSmile />
          </div>
        </div>
      </div>
      <div className={` absolute top-16 right-4 ${emoji ? "hidden" : "block"}`}>
        <EmojiPicker />
      </div>
    </div>
  );
}

export default InputLoadMessages;
