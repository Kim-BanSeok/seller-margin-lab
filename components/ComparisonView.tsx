"use client";

import { motion } from "framer-motion";
import type { CalculationResult, TrafficLightStatus } from "@/lib/calc";
import type { Platform } from "@/lib/fees";
import { PLATFORM_NAMES } from "@/lib/fees";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Wallet, TrendingUp, Target, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

interface ComparisonViewProps {
  platform1: Platform;
  platform2: Platform;
  platform1Result: CalculationResult;
  platform2Result: CalculationResult;
  platform1Status: TrafficLightStatus;
  platform2Status: TrafficLightStatus;
}

export default function ComparisonView({
  platform1,
  platform2,
  platform1Result,
  platform2Result,
  platform1Status,
  platform2Status,
}: ComparisonViewProps) {
  const getStatusConfig = (status: TrafficLightStatus) => {
    switch (status) {
      case "RED":
        return {
          gradient: "from-red-500 to-rose-600",
          bgGradient: "from-red-50 to-rose-50",
          borderColor: "border-red-200",
          icon: AlertCircle,
          iconColor: "text-red-600",
        };
      case "YELLOW":
        return {
          gradient: "from-yellow-400 to-orange-500",
          bgGradient: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-200",
          icon: AlertTriangle,
          iconColor: "text-yellow-600",
        };
      case "GREEN":
        return {
          gradient: "from-green-500 to-emerald-600",
          bgGradient: "from-green-50 to-emerald-50",
          borderColor: "border-green-200",
          icon: CheckCircle2,
          iconColor: "text-green-600",
        };
    }
  };

  const getPlatformColor = (platform: Platform) => {
    const colors: Record<Platform, string> = {
      smartstore: "bg-blue-600",
      coupang: "bg-orange-600",
      "11st": "bg-purple-600",
      gmarket: "bg-yellow-600",
      auction: "bg-pink-600",
      interpark: "bg-indigo-600",
      ohouse: "bg-teal-600",
      cafe24: "bg-cyan-600",
      domeggook: "bg-green-600",
      other: "bg-gray-600",
    };
    return colors[platform] || "bg-gray-600";
  };

  const getPlatformGradient = (platform: Platform) => {
    const gradients: Record<Platform, string> = {
      smartstore: "from-blue-600 via-indigo-600 to-purple-600",
      coupang: "from-orange-500 via-red-500 to-pink-600",
      "11st": "from-purple-500 via-indigo-500 to-blue-600",
      gmarket: "from-yellow-500 via-orange-500 to-red-600",
      auction: "from-pink-500 via-rose-500 to-red-600",
      interpark: "from-indigo-500 via-purple-500 to-pink-600",
      ohouse: "from-teal-500 via-cyan-500 to-blue-600",
      cafe24: "from-cyan-500 via-blue-500 to-indigo-600",
      domeggook: "from-green-500 via-emerald-500 to-teal-600",
      other: "from-gray-500 via-slate-500 to-gray-600",
    };
    return gradients[platform] || "from-gray-500 via-slate-500 to-gray-600";
  };

  const p1Config = getStatusConfig(platform1Status);
  const p2Config = getStatusConfig(platform2Status);
  const P1Icon = p1Config.icon;
  const P2Icon = p2Config.icon;

  const payoutDiff = platform1Result.netPayout - platform2Result.netPayout;
  const marginDiff = platform1Result.netMarginRate - platform2Result.netMarginRate;

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="grid grid-cols-2 gap-2">
        {/* 플랫폼 1 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <div className={`px-2 py-1 ${getPlatformColor(platform1)} text-white rounded text-xs font-semibold text-center`}>
            {PLATFORM_NAMES[platform1]}
          </div>

          <div className={`bg-gradient-to-br ${getPlatformGradient(platform1)} rounded-lg p-3 text-white shadow-sm`}>
            <div className="flex items-center gap-1 mb-1">
              <Wallet className="w-3 h-3" />
              <span className="text-xs opacity-90">정산금액</span>
            </div>
            <div className="text-base font-bold">{formatCurrency(platform1Result.netPayout)}</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-3 text-white shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs opacity-90">마진율</span>
            </div>
            <div className="text-base font-bold">
              {formatPercent(platform1Result.netMarginRate)}
            </div>
          </div>

          <div className={`bg-gradient-to-br ${p1Config.bgGradient} border ${p1Config.borderColor} rounded-lg p-2`}>
            <div className="flex items-center gap-1.5">
              <P1Icon className={`w-3 h-3 ${p1Config.iconColor}`} />
              <span className="text-xs font-medium text-gray-800">{platform1Status}</span>
            </div>
          </div>
        </motion.div>

        {/* 플랫폼 2 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <div className={`px-2 py-1 ${getPlatformColor(platform2)} text-white rounded text-xs font-semibold text-center`}>
            {PLATFORM_NAMES[platform2]}
          </div>

          <div className={`bg-gradient-to-br ${getPlatformGradient(platform2)} rounded-lg p-3 text-white shadow-sm`}>
            <div className="flex items-center gap-1 mb-1">
              <Wallet className="w-3 h-3" />
              <span className="text-xs opacity-90">정산금액</span>
            </div>
            <div className="text-base font-bold">{formatCurrency(platform2Result.netPayout)}</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-3 text-white shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs opacity-90">마진율</span>
            </div>
            <div className="text-base font-bold">{formatPercent(platform2Result.netMarginRate)}</div>
          </div>

          <div className={`bg-gradient-to-br ${p2Config.bgGradient} border ${p2Config.borderColor} rounded-lg p-2`}>
            <div className="flex items-center gap-1.5">
              <P2Icon className={`w-3 h-3 ${p2Config.iconColor}`} />
              <span className="text-xs font-medium text-gray-800">{platform2Status}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 비교 결과 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200"
      >
        <h3 className="text-xs font-bold text-gray-800 mb-2">비교 결과</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded p-2 border border-gray-200">
            <div className="text-xs text-gray-600 mb-0.5">정산금액 차이</div>
            <div
              className={`text-sm font-bold ${
                payoutDiff > 0 ? "text-green-600" : payoutDiff < 0 ? "text-red-600" : "text-gray-600"
              }`}
            >
              {payoutDiff > 0 ? "+" : ""}
              {formatCurrency(payoutDiff)}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {PLATFORM_NAMES[platform1]} 기준
            </div>
          </div>
          <div className="bg-white rounded p-2 border border-gray-200">
            <div className="text-xs text-gray-600 mb-0.5">마진율 차이</div>
            <div
              className={`text-sm font-bold ${
                marginDiff > 0 ? "text-green-600" : marginDiff < 0 ? "text-red-600" : "text-gray-600"
              }`}
            >
              {marginDiff > 0 ? "+" : ""}
              {formatPercent(marginDiff)}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {PLATFORM_NAMES[platform1]} 기준
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

