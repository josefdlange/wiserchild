"use client";

import React from "react";

/* SVG recreations of classic AIM icons */

export function AimLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Running man silhouette - simplified AIM logo */}
      <circle cx="24" cy="24" r="23" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
      <g transform="translate(12, 6)">
        {/* Head */}
        <circle cx="12" cy="6" r="4" fill="#000" />
        {/* Body */}
        <path
          d="M12 10 L12 22 M12 14 L6 20 M12 14 L18 18 M12 22 L7 32 M12 22 L17 32"
          stroke="#000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function BuddyIcon({ online = true }: { online?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Classic AIM buddy icon - running person */}
      <rect width="16" height="16" rx="1" fill={online ? "#FFD700" : "#C0C0C0"} />
      <g transform="translate(3, 1)">
        <circle cx="5" cy="2.5" r="2" fill={online ? "#000" : "#808080"} />
        <path
          d="M5 5 L5 10 M5 6.5 L2 9 M5 6.5 L8 8 M5 10 L3 14 M5 10 L7 14"
          stroke={online ? "#000" : "#808080"}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function WiserChildIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Robot/bot icon for WiserChild */}
      <rect width="16" height="16" rx="1" fill="#4A90D9" />
      <rect x="4" y="3" width="8" height="7" rx="1" fill="#E0E0E0" stroke="#333" strokeWidth="0.5" />
      <rect x="5.5" y="5" width="2" height="2" rx="0.5" fill="#333" />
      <rect x="8.5" y="5" width="2" height="2" rx="0.5" fill="#333" />
      <rect x="6" y="8" width="4" height="0.8" fill="#333" />
      <rect x="3" y="11" width="10" height="3" rx="1" fill="#E0E0E0" stroke="#333" strokeWidth="0.5" />
      {/* Antenna */}
      <line x1="8" y1="3" x2="8" y2="1" stroke="#333" strokeWidth="0.8" />
      <circle cx="8" cy="1" r="0.8" fill="#FF4444" />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="2" width="12" height="9" rx="1" fill="#FFFF99" stroke="#808080" strokeWidth="0.5" />
      <path d="M4 11 L3 14 L6 11" fill="#FFFF99" stroke="#808080" strokeWidth="0.5" />
      <line x1="3" y1="5" x2="11" y2="5" stroke="#808080" strokeWidth="0.5" />
      <line x1="3" y1="7" x2="9" y2="7" stroke="#808080" strokeWidth="0.5" />
      <line x1="3" y1="9" x2="10" y2="9" stroke="#808080" strokeWidth="0.5" />
    </svg>
  );
}
