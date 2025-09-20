"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ 
  children, 
  content, 
  className,
  side = "top"
}: TooltipProps) {
  return (
    <div className="relative inline-block group">
      {children}
      <div
        className={cn(
          "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          "min-w-64 max-w-xl break-words whitespace-normal",
          side === "top" && "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
          side === "bottom" && "top-full left-1/2 transform -translate-x-1/2 mt-2",
          side === "left" && "right-full top-1/2 transform -translate-y-1/2 mr-2",
          side === "right" && "left-full top-1/2 transform -translate-y-1/2 ml-2",
          className
        )}
      >
        {content}
        {/* Arrow */}
        <div
          className={cn(
            "absolute w-2 h-2 bg-gray-900 transform rotate-45",
            side === "top" && "top-full left-1/2 -translate-x-1/2 -mt-1",
            side === "bottom" && "bottom-full left-1/2 -translate-x-1/2 -mb-1",
            side === "left" && "left-full top-1/2 -translate-y-1/2 -ml-1",
            side === "right" && "right-full top-1/2 -translate-y-1/2 -mr-1"
          )}
        />
      </div>
    </div>
  );
}
