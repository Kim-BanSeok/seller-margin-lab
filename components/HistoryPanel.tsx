"use client";

import { useState, useEffect } from "react";
import { History, X, Download, Trash2 } from "lucide-react";
import type { SavedCalculation } from "@/lib/storage";
import {
  getSavedCalculations,
  deleteCalculation,
  clearAllCalculations,
} from "@/lib/storage";
import { formatCurrency, formatPercent } from "@/lib/utils";
import toast from "react-hot-toast";

interface HistoryPanelProps {
  onLoad: (calculation: SavedCalculation) => void;
  onClose: () => void;
}

export default function HistoryPanel({ onLoad, onClose }: HistoryPanelProps) {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);

  useEffect(() => {
    setCalculations(getSavedCalculations());
  }, []);

  const handleLoad = (calc: SavedCalculation) => {
    onLoad(calc);
    toast.success("계산 결과를 불러왔습니다");
    onClose();
  };

  const handleDelete = (id: string) => {
    deleteCalculation(id);
    setCalculations(getSavedCalculations());
    toast.success("삭제되었습니다");
  };

  const handleClearAll = () => {
    if (confirm("모든 히스토리를 삭제하시겠습니까?")) {
      clearAllCalculations();
      setCalculations([]);
      toast.success("모든 히스토리가 삭제되었습니다");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-800">계산 히스토리</h2>
            <span className="text-sm text-gray-500">({calculations.length}개)</span>
          </div>
          <div className="flex gap-2">
            {calculations.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                전체 삭제
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {calculations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>저장된 계산 결과가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2">
              {calculations.map((calc) => (
                <div
                  key={calc.id}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">{calc.name}</h3>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {calc.platform === "smartstore" ? "스마트스토어" : "쿠팡"}
                        </span>
                      </div>
                      {calc.result && (
                        <div className="flex gap-4 text-sm text-gray-600 mb-2">
                          <span>실수령: {formatCurrency(calc.result.netPayout)}</span>
                          <span>마진율: {formatPercent(calc.result.netMarginRate)}</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(calc.timestamp).toLocaleString("ko-KR")}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleLoad(calc)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        불러오기
                      </button>
                      <button
                        onClick={() => handleDelete(calc.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

