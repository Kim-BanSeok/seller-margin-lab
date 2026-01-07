"use client";

import { useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { simulateSales } from "@/lib/calc-extended";
import type { InputData } from "@/lib/fees";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SalesSimulationProps {
  inputData: InputData;
}

export default function SalesSimulation({ inputData }: SalesSimulationProps) {
  const [quantity, setQuantity] = useState(100);

  const result = simulateSales(inputData, quantity);

  const chartData = [
    { name: "매출", value: result.totalRevenue, color: "#3b82f6" },
    { name: "비용", value: result.totalCosts, color: "#ef4444" },
    { name: "수수료", value: result.totalFees, color: "#f59e0b" },
    { name: "순이익", value: result.netProfit, color: "#10b981" },
  ].filter((item) => item.value > 0);

  const quickQuantities = [10, 50, 100, 200, 500, 1000];

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-800">판매량별 수익 시뮬레이션</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">판매량 (개)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="0"
            />
            <div className="flex flex-wrap gap-1">
              {quickQuantities.map((qty) => (
                <button
                  key={qty}
                  onClick={() => setQuantity(qty)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    quantity === qty
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {inputData.salePrice > 0 && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-blue-50 rounded border border-blue-100">
                <div className="text-xs text-gray-600 mb-0.5">총 매출</div>
                <div className="text-sm font-bold text-blue-700">
                  {formatCurrency(result.totalRevenue)}
                </div>
              </div>
              <div className="p-2 bg-green-50 rounded border border-green-100">
                <div className="text-xs text-gray-600 mb-0.5">순이익</div>
                <div className="text-sm font-bold text-green-700">
                  {formatCurrency(result.netProfit)}
                </div>
              </div>
              <div className="p-2 bg-red-50 rounded border border-red-100">
                <div className="text-xs text-gray-600 mb-0.5">총 비용</div>
                <div className="text-sm font-bold text-red-700">
                  {formatCurrency(result.totalCosts)}
                </div>
              </div>
              <div className="p-2 bg-orange-50 rounded border border-orange-100">
                <div className="text-xs text-gray-600 mb-0.5">단위당 이익</div>
                <div className="text-sm font-bold text-orange-700">
                  {formatCurrency(result.averageProfitPerUnit)}
                </div>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="mt-3">
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={11}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ fontSize: "11px" }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

