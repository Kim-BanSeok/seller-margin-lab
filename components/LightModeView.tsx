"use client";

import { useState } from "react";
import { Calculator, DollarSign, TrendingUp, Package } from "lucide-react";
import type { InputData } from "@/lib/fees";
import type { CalculationResult, TrafficLightStatus } from "@/lib/calc";
import { formatCurrency, formatPercent } from "@/lib/utils";
import PlatformDropdown from "./PlatformDropdown";
import type { Platform } from "@/lib/fees";

interface LightModeViewProps {
  platform: Platform | "compare";
  inputData: InputData;
  result: CalculationResult;
  status: TrafficLightStatus;
  onPlatformChange: (platform: Platform | "compare") => void;
  onInputChange: (field: keyof InputData, value: number) => void;
}

export default function LightModeView({
  platform,
  inputData,
  result,
  status,
  onPlatformChange,
  onInputChange,
}: LightModeViewProps) {
  const handleChange = (field: keyof InputData, value: string) => {
    const numValue = parseFloat(value) || 0;
    onInputChange(field, numValue);
  };

  const getStatusColor = () => {
    switch (status) {
      case "RED":
        return "text-red-600 dark:text-red-400";
      case "YELLOW":
        return "text-yellow-600 dark:text-yellow-400";
      case "GREEN":
        return "text-green-600 dark:text-green-400";
    }
  };

  return (
    <div className="space-y-4">
      {/* 상단 요약 카드 */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-800 dark:from-blue-800 dark:to-indigo-900 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div>
            <div className="text-xs sm:text-sm opacity-90 mb-1">정산금액</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">{formatCurrency(result.netPayout)}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm opacity-90 mb-1">순이익</div>
            <div className={`text-lg sm:text-xl md:text-2xl font-bold leading-tight ${getStatusColor()}`}>
              {result.netProfit >= 0 ? "이익 " : "손실 "}
              {formatCurrency(Math.abs(result.netProfit ?? result.netPayout))}
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm opacity-90 mb-1">마진율</div>
            <div className={`text-lg sm:text-xl md:text-2xl font-bold leading-tight ${getStatusColor()}`}>
              {formatPercent(result.netMarginRate)}
            </div>
          </div>
        </div>
      </div>

      {/* 입력 폼 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-700 p-3 sm:p-4 shadow-md">
        <div className="space-y-3 sm:space-y-3">
          <div>
            <label className="block text-sm font-medium text-green-700 dark:text-green-400 mb-1">
              판매가격
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputData.salePrice || ""}
                onChange={(e) => handleChange("salePrice", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="0"
              />
              <span className="self-center text-sm text-gray-600 dark:text-gray-400">원</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 dark:text-green-400 mb-1">
              받은 배송비
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputData.receivedShipping || ""}
                onChange={(e) => handleChange("receivedShipping", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="0"
              />
              <span className="self-center text-sm text-gray-600 dark:text-gray-400">원</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-1">
              매입가
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputData.cost || ""}
                onChange={(e) => handleChange("cost", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="0"
              />
              <span className="self-center text-sm text-gray-600 dark:text-gray-400">원</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-1">
              보낸 배송비
            </label>
            <div className="text-xs text-red-600 dark:text-red-400 mb-1">(택배비·포장비)</div>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputData.shipOut || ""}
                onChange={(e) => handleChange("shipOut", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="0"
              />
              <span className="self-center text-sm text-gray-600 dark:text-gray-400">원</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-1">
              수수료
            </label>
            <PlatformDropdown platform={platform} onPlatformChange={onPlatformChange} />
          </div>

          {platform !== "compare" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  매체 수수료
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputData.platformFeeRate ? (inputData.platformFeeRate * 100).toFixed(2) : ""}
                    onChange={(e) => {
                      const percentValue = parseFloat(e.target.value) || 0;
                      handleChange("platformFeeRate", (percentValue / 100).toString());
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    placeholder="0"
                    step="0.01"
                  />
                  <span className="self-center text-sm text-gray-600 dark:text-gray-400">%</span>
                </div>
              </div>

              {inputData.shippingFeeRate !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    배송비 수수료
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={inputData.shippingFeeRate ? (inputData.shippingFeeRate * 100).toFixed(2) : ""}
                      onChange={(e) => {
                        const percentValue = parseFloat(e.target.value) || 0;
                        handleChange("shippingFeeRate", (percentValue / 100).toString());
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      placeholder="0"
                      step="0.01"
                    />
                    <span className="self-center text-sm text-gray-600 dark:text-gray-400">%</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

