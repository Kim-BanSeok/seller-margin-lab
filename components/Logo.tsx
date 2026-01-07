"use client";

import { Calculator, TrendingUp } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-2">
      {/* 로고 아이콘 */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* 배경 원형 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg"></div>
        
        {/* 계산기 아이콘 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Calculator className={`${iconSizes[size]} text-white`} strokeWidth={2.5} />
        </div>
        
        {/* 상단 우측 트렌드 아이콘 (작은 장식) */}
        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 shadow-md">
          <TrendingUp className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* 텍스트 (선택적) */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            실마진
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 leading-tight -mt-0.5">
            계산기
          </span>
        </div>
      )}
    </div>
  );
}
