"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: any[] & { loaded?: boolean };
  }
}

interface AdBannerProps {
  className?: string;
}

export default function AdBanner({ className = "" }: AdBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      // AdSense 스크립트 로드 확인
      if (typeof window === "undefined" || !window.adsbygoogle) {
        // 스크립트가 아직 로드되지 않은 경우
        const checkInterval = setInterval(() => {
          if (window.adsbygoogle) {
            clearInterval(checkInterval);
            initializeAd();
          }
        }, 100);

        // 10초 후 타임아웃
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!window.adsbygoogle) {
            console.warn("AdSense 스크립트 로드 실패");
            setIsLoaded(true); // 에러 상태로 표시
          }
        }, 10000);

        return () => clearInterval(checkInterval);
      }

      initializeAd();
    } catch (err) {
      console.error("AdSense 초기화 오류:", err);
      setIsLoaded(true); // 에러 상태로 표시
    }

    function initializeAd() {
      try {
        if (window.adsbygoogle && (window.adsbygoogle as any).loaded) {
          setIsLoaded(true);
          return;
        }
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        
        // 광고 로드 확인을 위한 타이머
        const timer = setTimeout(() => {
          setIsLoaded(true);
        }, 2000);
        
        return () => clearTimeout(timer);
      } catch (err) {
        console.error("AdSense 푸시 오류:", err);
        setIsLoaded(true);
      }
    }
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {/* 배너 박스 표시 */}
      <div className="relative border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs sm:text-sm text-blue-600 font-medium mb-1">
            광고 영역
          </div>
          <div className="text-[10px] sm:text-xs text-blue-400">
            광고가 곧 표시됩니다
          </div>
        </div>
        
        {/* 실제 광고 */}
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: "100px" }}
          data-ad-client="ca-pub-7373977880685678"
          data-ad-slot="4329998296"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

