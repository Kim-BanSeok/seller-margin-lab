"use client";

import { useState } from "react";
import {
  Calculator,
  Target,
  BarChart3,
  Calendar,
  TrendingUp,
  GitCompare,
  FileText,
  Bell,
  History,
  Settings,
  ChevronDown,
} from "lucide-react";

type FeatureTab = "main" | "target" | "simulation" | "forecast" | "roi" | "scenario" | "history" | "preset";

interface FeatureTabsProps {
  activeTab: FeatureTab;
  onTabChange: (tab: FeatureTab) => void;
}

export default function FeatureTabs({ activeTab, onTabChange }: FeatureTabsProps) {
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  const tabs: Array<{ id: FeatureTab; label: string; icon: React.ReactNode }> = [
    { id: "main", label: "기본 계산", icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: "target", label: "목표 마진", icon: <Target className="w-3.5 h-3.5" /> },
    { id: "simulation", label: "판매 시뮬", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: "forecast", label: "월별 예측", icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: "roi", label: "ROI", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: "scenario", label: "시나리오", icon: <GitCompare className="w-3.5 h-3.5" /> },
    { id: "history", label: "히스토리", icon: <History className="w-3.5 h-3.5" /> },
    { id: "preset", label: "프리셋", icon: <Settings className="w-3.5 h-3.5" /> },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <>
      {/* 모바일: 드롭다운 */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="기능 탭 선택"
          aria-expanded={isMobileDropdownOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2">
            {activeTabData.icon}
            <span>{activeTabData.label}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
              isMobileDropdownOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {isMobileDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10 bg-black/20"
              onClick={() => setIsMobileDropdownOpen(false)}
            />
            <div 
              className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto"
              role="listbox"
              aria-label="기능 탭 목록"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsMobileDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium border-l-2 border-blue-600 dark:border-blue-500"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  role="option"
                  aria-selected={activeTab === tab.id}
                  aria-label={tab.label}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 데스크톱: 탭 형태 */}
      <div className="hidden sm:flex gap-1 overflow-x-auto pb-2 mb-3 scrollbar-hide -mx-1 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 dark:bg-blue-500 text-white shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
            }`}
            aria-label={tab.label}
            aria-pressed={activeTab === tab.id}
            role="tab"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
