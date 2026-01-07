"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Platform } from "@/lib/fees";
import { PLATFORM_NAMES } from "@/lib/fees";

interface PlatformDropdownProps {
  platform: Platform | "compare";
  onPlatformChange: (platform: Platform | "compare") => void;
}

export default function PlatformDropdown({
  platform,
  onPlatformChange,
}: PlatformDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const platforms: Array<{ id: Platform | "compare"; name: string }> = [
    { id: "smartstore", name: PLATFORM_NAMES.smartstore },
    { id: "coupang", name: PLATFORM_NAMES.coupang },
    { id: "11st", name: PLATFORM_NAMES["11st"] },
    { id: "gmarket", name: PLATFORM_NAMES.gmarket },
    { id: "auction", name: PLATFORM_NAMES.auction },
    { id: "interpark", name: PLATFORM_NAMES.interpark },
    { id: "ohouse", name: PLATFORM_NAMES.ohouse },
    { id: "cafe24", name: PLATFORM_NAMES.cafe24 },
    { id: "domeggook", name: PLATFORM_NAMES.domeggook },
    { id: "other", name: PLATFORM_NAMES.other },
    { id: "compare", name: "플랫폼 비교" },
  ];

  const selectedName =
    platform === "compare"
      ? "플랫폼 비교"
      : PLATFORM_NAMES[platform as Platform];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span>{selectedName}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
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
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onPlatformChange(p.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  platform === p.id ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

