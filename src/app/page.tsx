"use client";

import React, { useState, useCallback } from "react";
import LoginScreen from "@/components/LoginScreen";
import BuddyList from "@/components/BuddyList";
import ChatWindow from "@/components/ChatWindow";
import { playDoorOpen, playDoorClose } from "@/lib/sounds";

type WindowId = "buddyList" | "chat";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screenName, setScreenName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [focusOrder, setFocusOrder] = useState<WindowId[]>([
    "buddyList",
    "chat",
  ]);

  const handleLogin = useCallback((name: string, key: string) => {
    setScreenName(name);
    setApiKey(key);
    setLoggedIn(true);
    playDoorOpen();
  }, []);

  const handleSignOff = useCallback(() => {
    playDoorClose();
    setLoggedIn(false);
    setScreenName("");
    setApiKey("");
    setChatOpen(false);
  }, []);

  const handleOpenChat = useCallback(() => {
    setChatOpen(true);
    setFocusOrder(["buddyList", "chat"]);
  }, []);

  const handleCloseChat = useCallback(() => {
    setChatOpen(false);
  }, []);

  const bringToFront = useCallback((windowId: WindowId) => {
    setFocusOrder((prev) => {
      const next = prev.filter((id) => id !== windowId);
      next.push(windowId);
      return next;
    });
  }, []);

  const getZIndex = useCallback(
    (windowId: WindowId) => {
      return 10 + focusOrder.indexOf(windowId);
    },
    [focusOrder]
  );

  if (!loggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="aim-desktop h-screen w-screen relative overflow-hidden">
      {/* Taskbar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[28px] flex items-center px-1 z-50"
        style={{
          background: "#c0c0c0",
          borderTop: "2px solid #ffffff",
        }}
      >
        {/* Start-esque button */}
        <button
          className="win-button !text-[11px] !min-w-0 !px-2 h-[22px] flex items-center gap-1 font-bold"
          onClick={() => bringToFront("buddyList")}
        >
          <span className="text-[8px]">🏃</span> AIM
        </button>

        {/* Window tabs */}
        <div className="flex gap-[2px] ml-2 flex-1">
          <button
            className="h-[22px] px-2 text-[11px] text-left truncate max-w-[160px]"
            style={{
              background:
                focusOrder[focusOrder.length - 1] === "buddyList"
                  ? "#ffffff"
                  : "#c0c0c0",
              borderTop: "2px solid #ffffff",
              borderLeft: "2px solid #ffffff",
              borderBottom: "2px solid #000000",
              borderRight: "2px solid #000000",
            }}
            onClick={() => bringToFront("buddyList")}
          >
            Buddy List
          </button>
          {chatOpen && (
            <button
              className="h-[22px] px-2 text-[11px] text-left truncate max-w-[160px]"
              style={{
                background:
                  focusOrder[focusOrder.length - 1] === "chat"
                    ? "#ffffff"
                    : "#c0c0c0",
                borderTop: "2px solid #ffffff",
                borderLeft: "2px solid #ffffff",
                borderBottom: "2px solid #000000",
                borderRight: "2px solid #000000",
              }}
              onClick={() => bringToFront("chat")}
            >
              WiserChild
            </button>
          )}
        </div>

        {/* Clock */}
        <Clock />
      </div>

      {/* Windows */}
      <BuddyList
        screenName={screenName}
        onOpenChat={handleOpenChat}
        onSignOff={handleSignOff}
        zIndex={getZIndex("buddyList")}
        onFocus={() => bringToFront("buddyList")}
      />

      {chatOpen && (
        <ChatWindow
          screenName={screenName}
          buddy="WiserChild"
          apiKey={apiKey}
          onClose={handleCloseChat}
          zIndex={getZIndex("chat")}
          onFocus={() => bringToFront("chat")}
        />
      )}
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="text-[11px] px-2 h-[22px] flex items-center"
      style={{
        borderTop: "2px solid #808080",
        borderLeft: "2px solid #808080",
        borderBottom: "2px solid #ffffff",
        borderRight: "2px solid #ffffff",
      }}
    >
      {time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}
    </div>
  );
}
