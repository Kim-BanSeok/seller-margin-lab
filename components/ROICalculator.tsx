"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, Clock } from "lucide-react";
import { calculateROI } from "@/lib/calc-extended";
import type { InputData } from "@/lib/fees";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface ROICalculatorProps {
  inputData: InputData;
}

export default function ROICalculator({ inputData }: ROICalculatorProps) {
  const [initialInvestment, setInitialInvestment] = useState(1000000);
  const [monthlySalesQuantity, setMonthlySalesQuantity] = useState(100);

  const roiResult = calculateROI(inputData, initialInvestment, monthlySalesQuantity);

  const quickInvestments = [500000, 1000000, 2000000, 5000000, 10000000];

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-800">ROI 계산</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">초기 투자 비용 (원)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="0"
            />
            <div className="flex flex-wrap gap-1">
              {quickInvestments.map((inv) => (
                <button
                  key={inv}
                  onClick={() => setInitialInvestment(inv)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    initialInvestment === inv
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {(inv / 10000).toFixed(0)}만
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">월 판매량 (개)</label>
          <input
            type="number"
            value={monthlySalesQuantity}
            onChange={(e) => setMonthlySalesQuantity(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            min="0"
          />
        </div>

        {inputData.salePrice > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-blue-50 rounded border border-blue-100">
                <div className="text-xs text-gray-600 mb-0.5">ROI</div>
                <div
                  className={`text-base font-bold ${
                    roiResult.roi > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatPercent(roiResult.roi)}
                </div>
              </div>
              <div className="p-2 bg-green-50 rounded border border-green-100">
                <div className="text-xs text-gray-600 mb-0.5">월 이익</div>
                <div className="text-base font-bold text-green-700">
                  {formatCurrency(roiResult.monthlyProfit)}
                </div>
              </div>
              <div className="p-2 bg-purple-50 rounded border border-purple-100">
                <div className="text-xs text-gray-600 mb-0.5">연간 이익</div>
                <div className="text-base font-bold text-purple-700">
                  {formatCurrency(roiResult.annualProfit)}
                </div>
              </div>
              <div className="p-2 bg-orange-50 rounded border border-orange-100">
                <div className="text-xs text-gray-600 mb-0.5">회수 기간</div>
                <div className="text-base font-bold text-orange-700">
                  {roiResult.paybackMonths === Infinity
                    ? "무한대"
                    : `${roiResult.paybackMonths.toFixed(1)}개월`}
                </div>
              </div>
            </div>

            {roiResult.paybackMonths !== Infinity && roiResult.paybackMonths < 12 && (
              <div className="p-2 bg-green-50 rounded border border-green-200">
                <div className="text-xs text-green-700">
                  투자금을 약 {roiResult.paybackMonths.toFixed(1)}개월 만에 회수할 수 있습니다
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

