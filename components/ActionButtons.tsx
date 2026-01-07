"use client";

import { useState } from "react";
import { Share2, RotateCcw, Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import toast, { Toaster } from "react-hot-toast";

interface ActionButtonsProps {
  onReset: () => void;
  shareUrl: string;
}

export default function ActionButtons({ onReset, shareUrl }: ActionButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      toast.success("링크가 클립보드에 복사되었습니다!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex gap-1.5 sm:gap-2">
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-3 py-2 sm:py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs sm:text-xs font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm min-w-[44px] sm:min-w-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">복사됨</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">공유</span>
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-3 py-2 sm:py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs sm:text-xs font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm min-w-[44px] sm:min-w-0"
        >
          <RotateCcw className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">초기화</span>
        </button>
      </div>
    </>
  );
}

