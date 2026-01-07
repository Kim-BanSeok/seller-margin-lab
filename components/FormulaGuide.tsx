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
      className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg border border-blue-200 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-blue-100/50 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <Calculator className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-sm sm:text-base font-bold text-gray-800">
              마진율은 이렇게 계산됩니다
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              부가세 포함 가격으로 작성해보세요
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 group-hover:text-gray-600"
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
              <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                <h4 className="text-xs sm:text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  마진율 계산 공식
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
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

              <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                <h4 className="text-xs sm:text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-green-600" />
                  수수료 안내
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
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

