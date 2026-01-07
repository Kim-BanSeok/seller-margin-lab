"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FormulaGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 dark:bg-blue-500 rounded-lg">
            <Calculator className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">
              마진율은 이렇게 계산됩니다
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              부가세 포함 가격으로 작성해보세요
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
        >
          <ChevronDown className="w-5 h-5" />
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
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  마진율 계산 공식
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <div>
                      <span className="font-semibold">마진율</span> = (판매가 - 매입가 - 수수료 - 부가세) / 판매가 × 100
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <div>
                      <span className="font-semibold">부가세</span> = (판매가 - 매입가) / ((100 + 부가세율)/100) × (부가세율/100)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <div>
                      <span className="font-semibold">정산금액</span> = 판매가 - 수수료
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <div>
                      <span className="font-semibold">순이익</span> = 판매가 - 매입가 - 수수료 - 부가세
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  수수료 안내
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <div>
                      <span className="font-semibold">기본 판매 수수료:</span> 각 플랫폼별 카테고리 수수료
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <div>
                      <span className="font-semibold">연동 수수료:</span> 네이버 쇼핑에 노출된 상품이 판매된 경우 발생하는 검색 광고비
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <div>
                      <span className="font-semibold">배송비 수수료:</span> 마켓 배송비 수수료
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

