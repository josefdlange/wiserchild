"use client";

import React, { useState } from "react";
import Window from "./Window";
import { BuddyIcon, WiserChildIcon } from "./AimIcons";

interface BuddyListProps {
  screenName: string;
  onOpenChat: (buddy: string) => void;
  onSignOff: () => void;
  zIndex: number;
  onFocus: () => void;
}

export default function BuddyList({
  screenName,
  onOpenChat,
  onSignOff,
  zIndex,
  onFocus,
}: BuddyListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Buddies: true,
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <Window
      title={`${screenName}'s Buddy List`}
      initialX={40}
      initialY={40}
      initialWidth={200}
      initialHeight={420}
      minWidth={160}
      minHeight={250}
      zIndex={zIndex}
      onFocus={onFocus}
      icon={<BuddyIcon online />}
    >
      {/* Menu bar */}
      <div
        className="flex px-1 py-[1px] text-[11px] shrink-0"
        style={{ borderBottom: "1px solid #808080" }}
      >
        <span className="px-2 hover:bg-[#000080] hover:text-white cursor-default">
          <u>P</u>eople
        </span>
        <span className="px-2 hover:bg-[#000080] hover:text-white cursor-default">
          <u>H</u>elp
        </span>
      </div>

      {/* Buddy list area */}
      <div className="flex-1 overflow-y-auto bg-white m-1" style={{
        borderTop: "2px solid #808080",
        borderLeft: "2px solid #808080",
        borderBottom: "2px solid #ffffff",
        borderRight: "2px solid #ffffff",
      }}>
        {/* Online section */}
        <div className="select-none">
          <div className="text-[11px] font-bold px-2 py-[2px] bg-[#e8e8e8] border-b border-[#c0c0c0]">
            Online
          </div>

          {/* Buddies group */}
          <div>
            <div
              className="flex items-center gap-1 px-2 py-[2px] cursor-pointer hover:bg-[#e8e8e8] text-[11px]"
              onClick={() => toggleGroup("Buddies")}
            >
              <span className="text-[9px]">
                {expandedGroups["Buddies"] ? "▼" : "►"}
              </span>
              <span className="font-bold">Buddies</span>
              <span className="text-gray-500">(1/1)</span>
            </div>

            {expandedGroups["Buddies"] && (
              <div
                className="flex items-center gap-2 px-6 py-[3px] cursor-pointer hover:bg-[#000080] hover:text-white group"
                onDoubleClick={() => onOpenChat("WiserChild")}
              >
                <WiserChildIcon />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold group-hover:text-white">
                    WiserChild
                  </span>
                  <span className="text-[9px] text-gray-500 group-hover:text-gray-200 italic">
                    I know things.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Offline section */}
        <div className="select-none mt-2">
          <div className="text-[11px] font-bold px-2 py-[2px] bg-[#e8e8e8] border-b border-[#c0c0c0]">
            Offline
          </div>
          <div className="text-[10px] text-gray-400 px-4 py-1 italic">
            No offline buddies
          </div>
        </div>
      </div>

      {/* Bottom section with sign off */}
      <div className="shrink-0 flex items-center justify-between px-2 py-1" style={{
        borderTop: "1px solid #ffffff",
      }}>
        <div className="text-[9px] text-gray-500 flex items-center gap-1">
          <div className="w-[6px] h-[6px] rounded-full bg-green-500" />
          Online
        </div>
        <button
          onClick={onSignOff}
          className="win-button !text-[9px] !min-w-0 !px-2"
        >
          Sign Off
        </button>
      </div>
    </Window>
  );
}
