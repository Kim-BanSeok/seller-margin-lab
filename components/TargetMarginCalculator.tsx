"use client";

import { useState } from "react";
import { Target, Calculator } from "lucide-react";
import { calculateTargetPrice } from "@/lib/calc-extended";
import type { InputData } from "@/lib/fees";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface TargetMarginCalculatorProps {
  inputData: InputData;
}

export default function TargetMarginCalculator({ inputData }: TargetMarginCalculatorProps) {
  const [targetMarginRate, setTargetMarginRate] = useState(15);

  const targetPrice = calculateTargetPrice(
    {
      cost: inputData.cost,
      shipOut: inputData.shipOut,
      packaging: inputData.packaging,
      adCostPerOrder: inputData.adCostPerOrder,
      otherVariable: inputData.otherVariable,
      returnRate: inputData.returnRate,
      returnShipBack: inputData.returnShipBack,
      platformFeeRate: inputData.platformFeeRate,
      paymentFeeRate: inputData.paymentFeeRate,
      extraFeeRate: inputData.extraFeeRate,
    },
    targetMarginRate
  );

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-800">목표 마진율 달성 판매가</h3>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">목표 마진율 (%)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={targetMarginRate}
              onChange={(e) => setTargetMarginRate(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="0"
              max="100"
              step="0.1"
            />
            <div className="flex gap-1">
              {[10, 15, 20, 25, 30].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setTargetMarginRate(rate)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    targetMarginRate === rate
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {targetPrice > 0 ? (
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded border border-blue-100">
            <div className="text-xs text-gray-600 mb-1">필요 판매가</div>
            <div className="text-lg font-bold text-blue-700">
              {formatCurrency(targetPrice)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatPercent(targetMarginRate)} 마진율을 달성하려면 이 가격 이상 판매해야 합니다
            </div>
          </div>
        ) : (
          <div className="p-3 bg-red-50 rounded border border-red-100">
            <div className="text-xs text-red-600">
              계산 불가: 수수료율이 너무 높거나 목표 마진율이 비현실적입니다
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

