"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Window from "./Window";
import { ChatIcon, WiserChildIcon } from "./AimIcons";
import { playMessageReceive, playMessageSend } from "@/lib/sounds";
import type { ChatMessage } from "@/lib/types";

interface ChatWindowProps {
  screenName: string;
  buddy: string;
  apiKey: string;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function ChatWindow({
  screenName,
  buddy,
  apiKey,
  onClose,
  zIndex,
  onFocus,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [warned, setWarned] = useState(false);
  const chatLogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasGreeted = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Send greeting from WiserChild on first open
  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;

    const greetingTimeout = setTimeout(() => {
      setIsTyping(true);
      const typingTimeout = setTimeout(() => {
        setMessages([
          {
            id: "greeting",
            sender: buddy,
            text: `Hey there! I'm WiserChild. I'm like SmarterChild, but I actually know stuff now. 😏\n\nAsk me anything -- trivia, math, jokes, advice, translations, code help, weather, stocks, definitions, games... you name it.\n\nType "help" to see what I can do!`,
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
        playMessageReceive();
      }, 1200);
      return () => clearTimeout(typingTimeout);
    }, 500);
    return () => clearTimeout(greetingTimeout);
  }, [buddy]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: screenName,
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    playMessageSend();

    // Focus back on input
    inputRef.current?.focus();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          screenName,
          apiKey,
          history: [...messages, userMsg]
            .filter((m) => m.id !== "greeting" || m.sender === buddy)
            .slice(-20)
            .map((m) => ({
              role: m.sender === screenName ? "user" : "assistant",
              content: m.text,
            })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: buddy,
        text: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
      playMessageReceive();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      const botMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: buddy,
        text: `Oops! Something went wrong. 😬\n\n${errorMessage}\n\nMake sure your API key is valid!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClose = () => {
    if (messages.length > 1 && !warned) {
      setWarned(true);
      return;
    }
    onClose();
  };

  return (
    <Window
      title={`${buddy} - Instant Message`}
      initialX={280}
      initialY={60}
      initialWidth={480}
      initialHeight={450}
      minWidth={350}
      minHeight={300}
      onClose={handleClose}
      zIndex={zIndex}
      onFocus={onFocus}
      icon={<ChatIcon />}
    >
      {/* Menu bar */}
      <div
        className="flex px-1 py-[1px] text-[11px] shrink-0"
        style={{ borderBottom: "1px solid #808080" }}
      >
        <span className="px-2 hover:bg-[#000080] hover:text-white cursor-default">
          <u>F</u>ile
        </span>
        <span className="px-2 hover:bg-[#000080] hover:text-white cursor-default">
          <u>E</u>dit
        </span>
        <span className="px-2 hover:bg-[#000080] hover:text-white cursor-default">
          <u>P</u>eople
        </span>
      </div>

      {/* Buddy info bar */}
      <div
        className="flex items-center gap-2 px-2 py-1 shrink-0"
        style={{ borderBottom: "1px solid #c0c0c0", background: "#e8e8e8" }}
      >
        <WiserChildIcon />
        <span className="text-[11px] font-bold">{buddy}</span>
        <span className="text-[9px] text-gray-500">- I know things.</span>
      </div>

      {/* Chat log */}
      <div
        ref={chatLogRef}
        className="flex-1 overflow-y-auto p-2 text-[12px]"
        style={{
          background: "#ffffff",
          margin: "2px 2px 0 2px",
          borderTop: "2px solid #808080",
          borderLeft: "2px solid #808080",
          borderBottom: "2px solid #ffffff",
          borderRight: "2px solid #ffffff",
          fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span
              className="font-bold"
              style={{
                color:
                  msg.sender === screenName
                    ? "#FF0000"
                    : msg.sender === buddy
                      ? "#0000FF"
                      : "#808080",
              }}
            >
              {msg.sender}
            </span>
            <span className="text-[9px] text-gray-400 ml-1">
              ({formatTime(msg.timestamp)})
            </span>
            <span>: </span>
            <span className="whitespace-pre-wrap">{msg.text}</span>
          </div>
        ))}
        {isTyping && (
          <div className="text-gray-400 italic text-[11px]">
            {buddy} is typing
            <span className="inline-block animate-pulse">...</span>
          </div>
        )}
        {warned && (
          <div className="text-[11px] text-gray-500 italic mt-1 p-2 bg-[#ffffcc] border border-[#cccc00]">
            Are you sure you want to close this conversation? Click the close
            button again to confirm.
          </div>
        )}
      </div>

      {/* Divider label */}
      <div className="px-2 py-[2px] text-[9px] text-gray-500 shrink-0 bg-[#c0c0c0]">
        <span className="text-[9px]">
          Last message received at{" "}
          {messages.length > 0
            ? formatTime(messages[messages.length - 1].timestamp)
            : "--"}
        </span>
      </div>

      {/* Input area */}
      <div className="shrink-0 flex flex-col" style={{ background: "#c0c0c0" }}>
        <div className="flex" style={{ margin: "0 2px 2px 2px" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setWarned(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={3}
            className="flex-1 resize-none p-1 text-[12px] outline-none"
            style={{
              borderTop: "2px solid #808080",
              borderLeft: "2px solid #808080",
              borderBottom: "2px solid #ffffff",
              borderRight: "2px solid #ffffff",
              fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
            }}
            autoFocus
          />
        </div>

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-2 py-1 shrink-0">
          {/* Formatting buttons placeholder */}
          <div className="flex gap-[2px]">
            <button className="win-button !min-w-0 !px-1 !py-0 text-[10px]">
              <b>B</b>
            </button>
            <button className="win-button !min-w-0 !px-1 !py-0 text-[10px]">
              <i>I</i>
            </button>
            <button className="win-button !min-w-0 !px-1 !py-0 text-[10px]">
              <u>U</u>
            </button>
            <span className="text-[9px] text-gray-500 ml-2 self-center">
              A
            </span>
          </div>

          <div className="flex gap-1">
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="win-button !text-[11px]"
              style={{
                opacity: !input.trim() || isTyping ? 0.6 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </Window>
  );
}
