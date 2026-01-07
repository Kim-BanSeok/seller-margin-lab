"use client";

import { GitCompare } from "lucide-react";
import type { Platform } from "@/lib/fees";

interface PlatformTabsProps {
  platform: Platform | "compare";
  onPlatformChange: (platform: Platform | "compare") => void;
}

export default function PlatformTabs({
  platform,
  onPlatformChange,
}: PlatformTabsProps) {
  return (
    <div className="flex gap-2 animate-fade-in">
      <button
        onClick={() => onPlatformChange("smartstore")}
        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          platform === "smartstore"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
        }`}
      >
        스마트스토어
      </button>
      <button
        onClick={() => onPlatformChange("coupang")}
        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          platform === "coupang"
            ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
        }`}
      >
        쿠팡
      </button>
      <button
        onClick={() => onPlatformChange("compare")}
        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
          platform === "compare"
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
        }`}
      >
        <GitCompare className="w-3.5 h-3.5" />
        <span>비교</span>
      </button>
    </div>
  );
}
