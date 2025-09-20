"use client";
import { useState, useRef, useEffect } from "react";
import TalkAILogo from "@/components/logos/TalkAI";
import "./test-chat-animations.css";

export default function TestChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What is TalkAI?",
    "How does pricing work?",
    "How are emotional scores calculated?",
    "Is my data private?",
  ];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    if (open && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function sendMessage(message?: string) {
    const msg = (message ?? input).trim();
    if (!msg) return;
    setLoading(true);
    setMessages((msgs) => [...msgs, { role: "user", content: msg }]);
    setInput("");
    const history = [...messages, { role: "user", content: msg }];

    const res = await fetch("/api/agent/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "public-user", // TODO: replace with real user logic
        messages: history,
      }),
    });
    const data = await res.json();
    const content = data.completion?.choices?.[0]?.message?.content || "(no response)";
    setMessages((msgs) => [...msgs, { role: "assistant", content }]);
    setLoading(false);
  }

  function handleSuggestedQuestion(q: string) {
    sendMessage(q);
  }

  function TypingIndicator() {
    return (
      <div className="flex items-center justify-center h-8">
        <span className="inline-block w-2 h-2 mx-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="inline-block w-2 h-2 mx-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span className="inline-block w-2 h-2 mx-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
      </div>
    );
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        aria-label="Open chat"
        className={`fixed z-50 bottom-10 right-10 rounded-full shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2 hover:scale-105 hover:animate-bounce transition-transform ${!open ? "chat-pulse" : ""}`}
        style={{ width: 64, height: 64 }}
        onClick={() => setOpen((v) => !v)}
      >
        <TalkAILogo className={`w-12 h-12 transition-transform duration-500 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Floating Chat Window */}
      {open && (
        <div
          className="fixed z-50 bottom-28 right-10 w-full max-w-xs sm:w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl flex flex-col"
          style={{ minHeight: '60vh', maxHeight: '90vh' }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-xl">
            <span className="font-bold text-lg">TalkAI Support</span>
            <button
              aria-label="Close chat"
              className="text-white hover:text-gray-200 text-2xl font-bold px-2"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          {/* Suggested Questions */}
          <div className="px-4 pt-3 pb-1">
            <div className="text-gray-500 text-sm mb-2">Suggested questions:</div>
            <div className="flex flex-col gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  className="w-full text-left bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg px-3 py-2 text-sm border border-transparent hover:border-blue-400 transition-colors"
                  onClick={() => handleSuggestedQuestion(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white dark:bg-gray-900">
            {messages.length === 0 && (
              <div className="text-gray-400 text-center mt-8">How can I help you today?</div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Assistant avatar */}
                {msg.role === "assistant" && (
                  <TalkAILogo className="w-8 h-8 rounded-full overflow-hidden" />
                )}

                <div
                  className={`rounded-lg px-3 py-2 max-w-[80%] text-sm shadow ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {msg.content}
                </div>

                {/* (Optional) spacing when user message aligns right */}
                {msg.role === "user" && <div className="w-8" />}
              </div>
            ))}
            {loading && <TypingIndicator />}
          </div>
          <form
            className="flex gap-2 p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-xl"
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading) sendMessage();
            }}
          >
            <input
              ref={inputRef}
              className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
} 