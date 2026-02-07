"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface WindowProps {
  title: string;
  children: React.ReactNode;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
  onClose?: () => void;
  zIndex?: number;
  onFocus?: () => void;
  icon?: React.ReactNode;
}

export default function Window({
  title,
  children,
  initialX = 100,
  initialY = 100,
  initialWidth = 300,
  initialHeight = 400,
  minWidth = 200,
  minHeight = 150,
  resizable = true,
  onClose,
  zIndex = 10,
  onFocus,
  icon,
}: WindowProps) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDownTitle = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      setDragging(true);
      dragOffset.current = {
        x: e.clientX - pos.x,
        y: e.clientY - pos.y,
      };
      onFocus?.();
      e.preventDefault();
    },
    [pos, onFocus]
  );

  const handleMouseDownResize = useCallback(
    (e: React.MouseEvent) => {
      setResizing(true);
      dragOffset.current = {
        x: e.clientX,
        y: e.clientY,
      };
      onFocus?.();
      e.preventDefault();
      e.stopPropagation();
    },
    [onFocus]
  );

  useEffect(() => {
    if (!dragging && !resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setPos({
          x: e.clientX - dragOffset.current.x,
          y: Math.max(0, e.clientY - dragOffset.current.y),
        });
      }
      if (resizing) {
        const dx = e.clientX - dragOffset.current.x;
        const dy = e.clientY - dragOffset.current.y;
        setSize((prev) => ({
          width: Math.max(minWidth, prev.width + dx),
          height: Math.max(minHeight, prev.height + dy),
        }));
        dragOffset.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, minWidth, minHeight]);

  return (
    <div
      ref={windowRef}
      onMouseDown={onFocus}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
        zIndex,
        userSelect: dragging || resizing ? "none" : "auto",
      }}
      className="flex flex-col"
    >
      {/* Outer border */}
      <div
        className="flex flex-col h-full"
        style={{
          borderTop: "2px solid #ffffff",
          borderLeft: "2px solid #ffffff",
          borderBottom: "2px solid #000000",
          borderRight: "2px solid #000000",
          background: "#c0c0c0",
          padding: "2px",
        }}
      >
        {/* Inner border */}
        <div
          className="flex flex-col h-full"
          style={{
            borderTop: "1px solid #dfdfdf",
            borderLeft: "1px solid #dfdfdf",
            borderBottom: "1px solid #808080",
            borderRight: "1px solid #808080",
          }}
        >
          {/* Title bar */}
          <div
            onMouseDown={handleMouseDownTitle}
            style={{
              background: "linear-gradient(to right, #000080, #1084d0)",
              cursor: dragging ? "grabbing" : "grab",
            }}
            className="flex items-center px-[3px] py-[2px] select-none shrink-0"
          >
            {icon && <span className="mr-[3px] flex items-center">{icon}</span>}
            <span
              className="text-white font-bold text-[11px] flex-1 truncate"
              style={{ textShadow: "none" }}
            >
              {title}
            </span>
            <div className="flex gap-[2px]">
              {onClose && (
                <button
                  onClick={onClose}
                  className="win-button !p-0 !min-w-0 flex items-center justify-center"
                  style={{ width: 16, height: 14, fontSize: 9, lineHeight: 1 }}
                  aria-label="Close"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">{children}</div>

          {/* Resize handle */}
          {resizable && (
            <div
              onMouseDown={handleMouseDownResize}
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 16,
                height: 16,
                cursor: "nwse-resize",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                style={{ position: "absolute", right: 1, bottom: 1 }}
              >
                <line
                  x1="14"
                  y1="3"
                  x2="3"
                  y2="14"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
                <line
                  x1="14"
                  y1="4"
                  x2="4"
                  y2="14"
                  stroke="#808080"
                  strokeWidth="1"
                />
                <line
                  x1="14"
                  y1="7"
                  x2="7"
                  y2="14"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
                <line
                  x1="14"
                  y1="8"
                  x2="8"
                  y2="14"
                  stroke="#808080"
                  strokeWidth="1"
                />
                <line
                  x1="14"
                  y1="11"
                  x2="11"
                  y2="14"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
                <line
                  x1="14"
                  y1="12"
                  x2="12"
                  y2="14"
                  stroke="#808080"
                  strokeWidth="1"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
