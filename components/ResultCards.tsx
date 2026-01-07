"use client";

import { memo } from "react";
import { Wallet, TrendingUp, Target, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import type { CalculationResult, TrafficLightStatus } from "@/lib/calc";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface ResultCardsProps {
  result: CalculationResult;
  status: TrafficLightStatus;
}

function ResultCards({ result, status }: ResultCardsProps) {
  const getStatusConfig = (status: TrafficLightStatus) => {
    switch (status) {
      case "RED":
        return {
          gradient: "from-red-500 to-rose-600",
          bgGradient: "from-red-50 to-rose-50",
          borderColor: "border-red-200",
          icon: AlertCircle,
          iconColor: "text-red-600",
          message: "손실 상태입니다. 판매가나 비용을 조정하세요.",
          badge: "위험",
        };
      case "YELLOW":
        return {
          gradient: "from-yellow-400 to-orange-500",
          bgGradient: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-200",
          icon: AlertTriangle,
          iconColor: "text-yellow-600",
          message: "저마진 상태입니다. 수익성을 개선하세요.",
          badge: "주의",
        };
      case "GREEN":
        return {
          gradient: "from-green-500 to-emerald-600",
          bgGradient: "from-green-50 to-emerald-50",
          borderColor: "border-green-200",
          icon: CheckCircle2,
          iconColor: "text-green-600",
          message: "양호한 마진 상태입니다.",
          badge: "양호",
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  const marginPercentage = Math.min(Math.max(result.netMarginRate, 0), 100);

  return (
    <div className="space-y-2 animate-fade-in">
      {/* 정산금액 & 순이익 */}
      <div className="grid grid-cols-2 gap-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-lg p-3 sm:p-3 text-white shadow-md"
          role="region"
          aria-label="정산금액"
        >
          <div className="flex items-center gap-1.5 mb-1.5 sm:mb-1">
            <Wallet className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
            <span className="text-xs sm:text-xs font-medium opacity-90">정산금액</span>
          </div>
          <div className="text-base sm:text-lg md:text-xl font-bold leading-tight" aria-live="polite">
            {formatCurrency(result.netPayout)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-3 sm:p-3 text-white shadow-md"
          role="region"
          aria-label="순이익"
        >
          <div className="flex items-center gap-1.5 mb-1.5 sm:mb-1">
            <TrendingUp className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
            <span className="text-xs sm:text-xs font-medium opacity-90">순이익</span>
          </div>
          <div className="text-base sm:text-lg md:text-xl font-bold leading-tight" aria-live="polite">
            {formatCurrency(result.netProfit ?? result.netPayout)}
          </div>
        </motion.div>
      </div>

      {/* 마진율 & 상태 */}
      <div className="grid grid-cols-2 gap-2">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-3 sm:p-3 text-white shadow-md"
        >
          <div className="flex items-center gap-1.5 mb-1.5 sm:mb-1">
            <TrendingUp className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="text-xs sm:text-xs font-medium opacity-90">마진율</span>
          </div>
          <div className="text-base sm:text-lg md:text-xl font-bold mb-1.5 leading-tight">
            {formatPercent(result.netMarginRate)}
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${marginPercentage}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </motion.div>
      </div>

      {/* 마진율 & 상태 */}
      <div className="grid grid-cols-2 gap-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-3 sm:p-3 text-white shadow-md"
        >
          <div className="flex items-center gap-1.5 mb-1.5 sm:mb-1">
            <TrendingUp className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="text-xs sm:text-xs font-medium opacity-90">마진율</span>
          </div>
          <div className="text-base sm:text-lg md:text-xl font-bold mb-1.5 leading-tight">
            {formatPercent(result.netMarginRate)}
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${marginPercentage}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </motion.div>

        {/* 손익분기 판매가 & 상태 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Target className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">BEP</span>
          </div>
          {result.bep === null ? (
            <div className="text-xs text-red-600 dark:text-red-400 font-medium">계산 불가</div>
          ) : (
            <div className="text-base font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(result.bep)}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={`relative overflow-hidden bg-gradient-to-br ${statusConfig.bgGradient} dark:from-gray-700 dark:to-gray-800 border ${statusConfig.borderColor} dark:border-gray-600 rounded-lg p-3 shadow-sm`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.iconColor} dark:text-gray-300`} />
            <span className={`text-xs font-bold px-2 py-0.5 rounded bg-gradient-to-r ${statusConfig.gradient} text-white`}>
              {statusConfig.badge}
            </span>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-tight">{statusConfig.message}</p>
        </motion.div>
      </div>
    </div>
  );
}

export default memo(ResultCards);
