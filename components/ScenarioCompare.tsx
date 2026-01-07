"use client";

import { useState } from "react";
import { GitCompare, Plus, X } from "lucide-react";
import type { InputData } from "@/lib/fees";
import type { CalculationResult } from "@/lib/calc";
import { calculateMargin } from "@/lib/calc";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface Scenario {
  id: string;
  name: string;
  inputData: InputData;
  result: CalculationResult;
}

interface ScenarioCompareProps {
  baseInputData: InputData;
}

export default function ScenarioCompare({ baseInputData }: ScenarioCompareProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: "scenario-1",
      name: "시나리오 A",
      inputData: { ...baseInputData },
      result: calculateMargin(baseInputData),
    },
  ]);

  const addScenario = () => {
    if (scenarios.length >= 3) {
      alert("최대 3개까지만 비교할 수 있습니다");
      return;
    }

    const newId = `scenario-${Date.now()}`;
    const newName = `시나리오 ${String.fromCharCode(65 + scenarios.length)}`;
    const newScenario: Scenario = {
      id: newId,
      name: newName,
      inputData: { ...baseInputData },
      result: calculateMargin(baseInputData),
    };
    setScenarios([...scenarios, newScenario]);
  };

  const removeScenario = (id: string) => {
    if (scenarios.length <= 1) {
      alert("최소 1개는 유지해야 합니다");
      return;
    }
    setScenarios(scenarios.filter((s) => s.id !== id));
  };

  const updateScenario = (id: string, field: keyof InputData, value: number) => {
    setScenarios(
      scenarios.map((s) => {
        if (s.id === id) {
          const updatedInput = { ...s.inputData, [field]: value };
          return {
            ...s,
            inputData: updatedInput,
            result: calculateMargin(updatedInput),
          };
        }
        return s;
      })
    );
  };

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-800">시나리오 비교</h3>
        </div>
        {scenarios.length < 3 && (
          <button
            onClick={addScenario}
            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            추가
          </button>
        )}
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario, index) => (
          <div key={scenario.id} className="border border-gray-200 rounded-lg p-2">
            <div className="flex items-center justify-between mb-2">
              <input
                type="text"
                value={scenario.name}
                onChange={(e) => {
                  setScenarios(
                    scenarios.map((s) =>
                      s.id === scenario.id ? { ...s, name: e.target.value } : s
                    )
                  );
                }}
                className="font-semibold text-sm text-gray-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
              />
              {scenarios.length > 1 && (
                <button
                  onClick={() => removeScenario(scenario.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-xs text-gray-600">판매가</label>
                <input
                  type="number"
                  value={scenario.inputData.salePrice}
                  onChange={(e) =>
                    updateScenario(scenario.id, "salePrice", parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">원가</label>
                <input
                  type="number"
                  value={scenario.inputData.cost}
                  onChange={(e) =>
                    updateScenario(scenario.id, "cost", parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 text-xs">
              <div className="p-1.5 bg-blue-50 rounded">
                <div className="text-gray-600">실수령</div>
                <div className="font-bold text-blue-700">
                  {formatCurrency(scenario.result.netPayout)}
                </div>
              </div>
              <div className="p-1.5 bg-green-50 rounded">
                <div className="text-gray-600">마진율</div>
                <div className="font-bold text-green-700">
                  {formatPercent(scenario.result.netMarginRate)}
                </div>
              </div>
              <div className="p-1.5 bg-orange-50 rounded">
                <div className="text-gray-600">BEP</div>
                <div className="font-bold text-orange-700">
                  {scenario.result.bep ? formatCurrency(scenario.result.bep) : "불가"}
                </div>
              </div>
            </div>
          </div>
        ))}

        {scenarios.length > 1 && (
          <div className="mt-3 p-2 bg-gray-50 rounded border border-gray-200">
            <div className="text-xs font-semibold text-gray-700 mb-1">비교 요약</div>
            <div className="space-y-1 text-xs">
              {scenarios.map((s, i) => (
                <div key={s.id} className="flex justify-between">
                  <span className="text-gray-600">{s.name}:</span>
                  <span className="font-medium">
                    {formatCurrency(s.result.netPayout)} (
                    {formatPercent(s.result.netMarginRate)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

