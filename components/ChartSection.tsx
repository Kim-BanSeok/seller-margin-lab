"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { CalculationResult } from "@/lib/calc";
import { formatCurrency } from "@/lib/utils";

interface ChartSectionProps {
  result: CalculationResult;
  salePrice: number;
}

export default function ChartSection({ result, salePrice }: ChartSectionProps) {
  // 파이 차트 데이터 (비용 구성)
  const pieData = [
    {
      name: "실수령",
      value: Math.max(0, result.netPayout),
      color: "#10b981", // green-500
    },
    {
      name: "수수료",
      value: result.totalFees,
      color: "#3b82f6", // blue-500
    },
    {
      name: "비용",
      value: result.totalCosts,
      color: "#ef4444", // red-500
    },
  ].filter((item) => item.value > 0);

  // 막대 차트 데이터 (비용 breakdown)
  const barData = [
    {
      name: "원가",
      value: result.totalCosts > 0 ? (result.totalCosts - result.expectedReturnCost) : 0,
    },
    {
      name: "반품비",
      value: result.expectedReturnCost,
    },
    {
      name: "수수료",
      value: result.totalFees,
    },
  ].filter((item) => item.value > 0);

  const COLORS = ["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6"];

  if (salePrice === 0) {
    return (
      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
        <p className="text-center text-xs text-gray-500">판매가를 입력하면 차트가 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {/* 파이 차트 - 비용 구성 */}
      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-800 mb-2">매출 구성</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 space-y-1">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700">{item.name}</span>
              </div>
              <span className="font-medium text-gray-900">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 막대 차트 - 비용 breakdown */}
      {barData.length > 0 && (
        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-800 mb-2">비용 상세</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis
                stroke="#6b7280"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

