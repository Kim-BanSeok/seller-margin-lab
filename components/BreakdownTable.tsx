"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Receipt, DollarSign, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CalculationResult } from "@/lib/calc";
import type { InputData } from "@/lib/fees";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface BreakdownTableProps {
  result: CalculationResult;
  inputData: InputData;
}

export default function BreakdownTable({
  result,
  inputData,
}: BreakdownTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 sm:px-3 py-3 sm:py-2 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group min-h-[44px] sm:min-h-0"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded">
            <Receipt className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-medium text-gray-800 text-sm">상세 내역</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 group-hover:text-gray-600"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3 border-t border-gray-100">
              {/* 매출 */}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <DollarSign className="w-3.5 h-3.5 text-green-600" />
                  <h4 className="text-xs font-semibold text-gray-800">매출</h4>
                </div>
                <div className="space-y-1">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded p-2 border border-green-100">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-700">판매가</span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(inputData.salePrice)}
                      </span>
                    </div>
                  </div>
                  {inputData.receivedShipping > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded p-2 border border-green-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-700">받은 배송비</span>
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(inputData.receivedShipping)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded p-2 border-2 border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-800">총 매출 (GMV)</span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(result.gmv)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 수수료 */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Receipt className="w-3.5 h-3.5 text-blue-600" />
                  <h4 className="text-xs font-semibold text-gray-800">수수료</h4>
                </div>
                <div className="space-y-1.5">
                  {[
                    {
                      label: "기본 판매 수수료",
                      rate: inputData.baseFeeRate ?? inputData.platformFeeRate ?? 0,
                      value: result.baseFee ?? result.platformFee ?? 0,
                      color: "from-blue-50 to-indigo-50",
                      borderColor: "border-blue-100",
                    },
                    {
                      label: "연동 수수료",
                      rate: inputData.linkageFeeRate ?? inputData.paymentFeeRate ?? 0,
                      value: result.linkageFee ?? result.paymentFee ?? 0,
                      color: "from-purple-50 to-pink-50",
                      borderColor: "border-purple-100",
                    },
                    ...(result.shippingFee > 0
                      ? [
                          {
                            label: "배송비 수수료",
                            rate: inputData.shippingFeeRate || 0,
                            value: result.shippingFee,
                            color: "from-teal-50 to-cyan-50",
                            borderColor: "border-teal-100",
                          },
                        ]
                      : []),
                    ...(result.vat > 0
                      ? [
                          {
                            label: "부가세",
                            rate: 0,
                            value: result.vat,
                            color: "from-amber-50 to-yellow-50",
                            borderColor: "border-amber-100",
                          },
                        ]
                      : []),
                  ].map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`bg-gradient-to-r ${item.color} rounded p-2 border ${item.borderColor} transition-shadow`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs font-medium text-gray-700">
                            {item.label}
                          </span>
                          <span className="text-xs text-gray-500 ml-1.5">
                            ({formatPercent(item.rate)})
                          </span>
                        </div>
                        <span className="text-xs font-bold text-gray-900">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  <div className="mt-2 pt-2 border-t border-gray-300 bg-gray-50 rounded p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-800">총 수수료</span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(result.totalFees)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 비용 */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Package className="w-3.5 h-3.5 text-red-600" />
                  <h4 className="text-xs font-semibold text-gray-800">비용</h4>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: "원가", value: inputData.cost },
                    { label: "출고 배송비", value: inputData.shipOut },
                    { label: "포장비", value: inputData.packaging },
                    { label: "주문당 광고비", value: inputData.adCostPerOrder },
                    { label: "기타 변동비", value: inputData.otherVariable },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-gray-50 rounded p-2 border border-gray-200 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-700">{item.label}</span>
                        <span className="text-xs font-medium text-gray-900">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-gradient-to-r from-amber-50 to-orange-50 rounded p-2 border border-amber-100"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-medium text-gray-700">
                          기대 반품 비용
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({inputData.returnRate.toFixed(1)}% ×{" "}
                          {formatCurrency(inputData.returnShipBack)})
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        {formatCurrency(result.expectedReturnCost)}
                      </span>
                    </div>
                  </motion.div>
                  <div className="mt-2 pt-2 border-t border-gray-300 bg-red-50 rounded p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-800">총 비용</span>
                      <span className="text-sm font-bold text-red-700">
                        {formatCurrency(result.totalCosts)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 총합 */}
              <div className="pt-2 border-t-2 border-gray-400 space-y-2">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">정산금액</span>
                    <span className="text-base font-bold text-white">
                      {formatCurrency(result.netPayout)}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">순이익</span>
                    <span className="text-base font-bold text-white">
                      {formatCurrency(result.netProfit ?? result.netPayout)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
