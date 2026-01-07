"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Platform } from "@/lib/fees";
import { PLATFORM_NAMES } from "@/lib/fees";

interface PlatformSelectorProps {
  label: string;
  value: Platform;
  exclude?: Platform;
  onChange: (platform: Platform) => void;
}

export default function PlatformSelector({
  label,
  value,
  exclude,
  onChange,
}: PlatformSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const platforms: Platform[] = [
    "smartstore",
    "coupang",
    "11st",
    "gmarket",
    "auction",
    "interpark",
    "ohouse",
    "cafe24",
    "domeggook",
    "other",
  ].filter((p) => p !== exclude) as Platform[];

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>{PLATFORM_NAMES[value]}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => {
                  onChange(p);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  value === p ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                }`}
              >
                {PLATFORM_NAMES[p]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

