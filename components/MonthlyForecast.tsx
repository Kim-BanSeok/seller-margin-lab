"use client";

import { useState } from "react";
import { Calendar, TrendingUp } from "lucide-react";
import { calculateAnnualForecast } from "@/lib/calc-extended";
import type { InputData } from "@/lib/fees";
import { formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MonthlyForecastProps {
  inputData: InputData;
}

export default function MonthlyForecast({ inputData }: MonthlyForecastProps) {
  const [monthlySales, setMonthlySales] = useState<number[]>([
    100, 120, 150, 130, 140, 160, 180, 170, 150, 140, 130, 120,
  ]);

  const forecast = calculateAnnualForecast(inputData, monthlySales);

  const chartData = forecast.monthly.map((m) => ({
    month: `${m.month}월`,
    수익: m.profit,
    매출: m.revenue,
    비용: m.costs + m.fees,
  }));

  const updateMonthlySales = (index: number, value: number) => {
    const updated = [...monthlySales];
    updated[index] = Math.max(0, value);
    setMonthlySales(updated);
  };

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-800">월별/연간 수익 예측</h3>
      </div>

      {inputData.salePrice > 0 ? (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-1 text-xs">
            {monthlySales.map((sales, index) => (
              <div key={index} className="space-y-1">
                <label className="block text-gray-600 text-center">{index + 1}월</label>
                <input
                  type="number"
                  value={sales}
                  onChange={(e) => updateMonthlySales(index, parseInt(e.target.value) || 0)}
                  className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="0"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-blue-50 rounded border border-blue-100">
              <div className="text-gray-600 mb-0.5">연간 총 매출</div>
              <div className="font-bold text-blue-700">{formatCurrency(forecast.totalRevenue)}</div>
            </div>
            <div className="p-2 bg-green-50 rounded border border-green-100">
              <div className="text-gray-600 mb-0.5">연간 순이익</div>
              <div className="font-bold text-green-700">{formatCurrency(forecast.totalProfit)}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded border border-gray-100">
              <div className="text-gray-600 mb-0.5">월평균 이익</div>
              <div className="font-bold text-gray-700">
                {formatCurrency(forecast.averageMonthlyProfit)}
              </div>
            </div>
            <div className="p-2 bg-orange-50 rounded border border-orange-100">
              <div className="text-gray-600 mb-0.5">총 비용</div>
              <div className="font-bold text-orange-700">
                {formatCurrency(forecast.totalCosts + forecast.totalFees)}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                <YAxis
                  stroke="#6b7280"
                  fontSize={10}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line
                  type="monotone"
                  dataKey="수익"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="매출"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="비용"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          판매가를 입력하면 예측이 표시됩니다
        </div>
      )}
    </div>
  );
}

