"use client";

import React, { useState } from "react";
import { AimLogo } from "./AimIcons";

interface LoginScreenProps {
  onLogin: (screenName: string, apiKey: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [screenName, setScreenName] = useState("");
  const [password, setPassword] = useState("");
  const [savePassword, setSavePassword] = useState(false);
  const [error, setError] = useState("");
  const [signingOn, setSigningOn] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSignOn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!screenName.trim()) {
      setError("Please enter a Screen Name.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password (Anthropic API Key).");
      return;
    }

    setSigningOn(true);
    setProgress(0);

    // Simulate the classic AIM sign-on progress
    const steps = [10, 25, 40, 55, 70, 85, 95, 100];
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        setProgress(steps[step]);
        step++;
      } else {
        clearInterval(interval);
        onLogin(screenName.trim(), password.trim());
      }
    }, 300);
  };

  return (
    <div className="aim-desktop h-screen w-screen flex items-center justify-center">
      {/* Sign On window */}
      <div
        style={{
          borderTop: "2px solid #ffffff",
          borderLeft: "2px solid #ffffff",
          borderBottom: "2px solid #000000",
          borderRight: "2px solid #000000",
          background: "#c0c0c0",
          padding: "2px",
          width: 300,
        }}
      >
        <div
          style={{
            borderTop: "1px solid #dfdfdf",
            borderLeft: "1px solid #dfdfdf",
            borderBottom: "1px solid #808080",
            borderRight: "1px solid #808080",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              background: "linear-gradient(to right, #000080, #1084d0)",
            }}
            className="flex items-center px-[3px] py-[2px] select-none"
          >
            <span className="text-white font-bold text-[11px] flex-1">
              Sign On
            </span>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col items-center">
            {/* AIM Logo */}
            <div className="mb-2">
              <AimLogo size={64} />
            </div>
            <div className="text-[14px] font-bold mb-1" style={{ color: "#000080" }}>
              AOL Instant Messenger
            </div>
            <div className="text-[9px] text-gray-600 mb-4">
              Version SM4RT.0
            </div>

            {signingOn ? (
              /* Sign-on progress */
              <div className="w-full flex flex-col items-center gap-3 py-4">
                <div className="text-[11px] font-bold">
                  Signing on as {screenName}...
                </div>
                {/* Progress bar */}
                <div
                  className="w-[200px] h-[18px]"
                  style={{
                    borderTop: "2px solid #808080",
                    borderLeft: "2px solid #808080",
                    borderBottom: "2px solid #ffffff",
                    borderRight: "2px solid #ffffff",
                    background: "#ffffff",
                    padding: "1px",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      background:
                        "repeating-linear-gradient(90deg, #000080 0px, #000080 8px, #ffffff 8px, #ffffff 10px)",
                      transition: "width 0.2s",
                    }}
                  />
                </div>
                <div className="text-[10px] text-gray-600">
                  {progress < 30
                    ? "Connecting..."
                    : progress < 60
                      ? "Verifying name and password..."
                      : progress < 90
                        ? "Starting services..."
                        : "Almost there..."}
                </div>
              </div>
            ) : (
              /* Login form */
              <form
                onSubmit={handleSignOn}
                className="w-full flex flex-col items-center gap-2"
              >
                <div className="w-full">
                  <label className="text-[11px] block mb-[2px]">
                    <u>S</u>creenName
                  </label>
                  <input
                    type="text"
                    value={screenName}
                    onChange={(e) => setScreenName(e.target.value)}
                    className="win-input w-full"
                    placeholder=""
                    autoFocus
                  />
                </div>

                <div className="w-full">
                  <label className="text-[11px] block mb-[2px]">
                    <u>P</u>assword{" "}
                    <span className="text-[9px] text-gray-500">
                      (Anthropic API Key)
                    </span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="win-input w-full"
                    placeholder=""
                  />
                </div>

                <div className="w-full flex items-center gap-1 mt-1">
                  <input
                    type="checkbox"
                    className="win-checkbox"
                    id="savePassword"
                    checked={savePassword}
                    onChange={(e) => setSavePassword(e.target.checked)}
                  />
                  <label htmlFor="savePassword" className="text-[11px]">
                    Save password
                  </label>
                </div>

                {error && (
                  <div className="text-[11px] text-red-700 w-full text-center">
                    {error}
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <button type="submit" className="win-button">
                    Sign On
                  </button>
                </div>

                <div className="text-[9px] text-gray-500 mt-2 text-center">
                  Get your API key at{" "}
                  <span style={{ color: "#0000FF", textDecoration: "underline" }}>
                    console.anthropic.com
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
