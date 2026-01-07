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
          aria-label={copied ? "링크 복사 완료" : "링크 복사"}
          aria-live="polite"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline" aria-hidden="true">복사됨</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline" aria-hidden="true">공유</span>
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-3 py-2 sm:py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs sm:text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 shadow-sm min-w-[44px] sm:min-w-0"
          aria-label="입력값 초기화"
        >
          <RotateCcw className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline" aria-hidden="true">초기화</span>
        </button>
      </div>
    </>
  );
}

