"use client";

import Link from "next/link";
import { TrendingUp, BookOpen } from "lucide-react";
import Logo from "./Logo";

export default function Header() {
  return (
    <div className="mb-3 sm:mb-4 animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3 mb-1.5">
        <Logo size="md" showText={false} />
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          셀러 실마진 계산기
        </h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 ml-12 sm:ml-10 leading-tight">
        <TrendingUp className="w-3 h-3 flex-shrink-0" />
        <span className="truncate">실마진 계산 · 플랫폼 비교 · 손익분기 분석</span>
        <Link
          href="/guide"
          className="inline-flex items-center gap-1 ml-1 sm:ml-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors shrink-0"
          title="실마진 계산 가이드"
        >
          <BookOpen className="w-3 h-3" />
          <span>가이드</span>
        </Link>
      </p>
    </div>
  );
}

