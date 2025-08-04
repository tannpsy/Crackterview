import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function ChatbotForm({ onClose }) {
  const botProfileImage =
    "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dPj38vYMjM/n9rtidyy_expires_30_days.png";

  const UserAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
      <svg
        className="w-6 h-6 text-gray-500"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

  const bottomRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/ai/chat", {
        history: [...messages, { from: "user", text: input }],
      });
      const botReply = response.data.reply;
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error talking to Gemini:", error);
      setMessages((prev) => [...prev, { from: "bot", text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    if (!hasLoadedHistory) {
      const savedMessages = localStorage.getItem("chatHistory");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([
          { from: "bot", text: "Hi! How can I assist you with interview prep today?" },
        ]);
      }
      setHasLoadedHistory(true);
    }
  }, [hasLoadedHistory]);

  useEffect(() => {
    if (hasLoadedHistory) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages, hasLoadedHistory]);

  useEffect(() => {
  if (bottomRef.current) {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);

  return (
    <div className="flex flex-col w-[360px] h-[600px] bg-white rounded-3xl border border-solid border-[#979797]" style={{ boxShadow: "0px 10px 4px #0000004D" }}>
      {/* Header */}
      <div className="flex items-center justify-between bg-[#F3A115] p-6 rounded-t-[20px]" style={{ boxShadow: "0px 24px 34px #AE090970" }}>
        <div className="flex items-center gap-2">
          <img src={botProfileImage} className="w-[46px] h-[42px] object-fill" alt="CrackBot Icon" />
          <span className="text-white text-2xl font-bold">CrackBot</span>
        </div>
        <button onClick={onClose}>
          <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dPj38vYMjM/xlas6kmc_expires_30_days.png" className="w-6 h-6 object-fill" alt="Minimize" />
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#F8F9FA] flex flex-col gap-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} gap-2`}>
            {msg.from === "bot" && (
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dPj38vYMjM/bxwdn5ym_expires_30_days.png"
                className="w-10 h-10 rounded-full bg-[#7B2CBF] p-1 object-fill"
                alt="Bot Avatar"
              />
            )}
            <div
              className={`p-3 shadow-sm max-w-[80%] ${
                msg.from === "user"
                  ? "bg-[#DEE2E6] text-[#444444] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
                  : "bg-[#3C096C] text-white rounded-tr-2xl rounded-bl-2xl rounded-br-2xl"
              }`}
            >
              <span className="whitespace-pre-line">{msg.text}</span>
            </div>
            {msg.from === "user" && <UserAvatar />}
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-500 italic">Gemini is typing...</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Chat Input */}
      <div className="flex flex-col bg-white py-4 rounded-b-[20px]" style={{ boxShadow: "0px -4px 16px #00000012" }}>
        <div className="flex items-center self-stretch bg-[#E8EBF0] p-3 mx-4 rounded-2xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="flex-1 bg-transparent text-[#444444] text-lg outline-none"
          />
          <button onClick={handleSend} className="flex-shrink-0 ml-2">
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dPj38vYMjM/pxy1jeeu_expires_30_days.png"
              className="w-6 h-6 rounded-2xl object-fill"
              alt="Send Icon"
            />
          </button>

        </div>
      </div>
    </div>
  );
}
