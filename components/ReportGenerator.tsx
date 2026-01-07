"use client";

import { useState } from "react";
import { FileText, Download, Image as ImageIcon } from "lucide-react";
import type { CalculationResult } from "@/lib/calc";
import type { InputData } from "@/lib/fees";
import type { Platform } from "@/lib/fees";
import { exportToCSV } from "@/lib/export";
import { formatCurrency, formatPercent } from "@/lib/utils";
// html2canvas는 동적 import로 사용
import toast from "react-hot-toast";

interface ReportGeneratorProps {
  inputData: InputData;
  result: CalculationResult;
  platform: Platform;
  reportRef?: React.RefObject<HTMLDivElement>;
}

export default function ReportGenerator({
  inputData,
  result,
  platform,
  reportRef,
}: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportCSV = () => {
    exportToCSV(inputData, result, platform === "smartstore" ? "스마트스토어" : "쿠팡");
    toast.success("CSV 파일이 다운로드되었습니다");
  };

  const handleExportImage = async () => {
    if (!reportRef?.current) {
      toast.error("리포트 영역을 찾을 수 없습니다");
      return;
    }

    setIsGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `margin-report-${Date.now()}.png`;
      link.href = url;
      link.click();
      toast.success("이미지가 다운로드되었습니다");
    } catch (error) {
      toast.error("이미지 생성에 실패했습니다");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-800">리포트 생성</h3>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleExportCSV}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          CSV 다운로드
        </button>
        <button
          onClick={handleExportImage}
          disabled={isGenerating}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          {isGenerating ? "생성 중..." : "이미지 저장"}
        </button>
      </div>
    </div>
  );
}

