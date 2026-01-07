"use client";

import { useState, useEffect, useMemo } from "react";
import { Bell, AlertCircle, AlertTriangle, CheckCircle2, Settings } from "lucide-react";
import type { CalculationResult, TrafficLightStatus } from "@/lib/calc";
import { getAlertSettings, saveAlertSettings, type AlertSettings } from "@/lib/storage";
import { formatPercent } from "@/lib/utils";

interface AlertSystemProps {
  result: CalculationResult;
  status: TrafficLightStatus;
}

export default function AlertSystem({ result, status }: AlertSystemProps) {
  const [settings, setSettings] = useState<AlertSettings>(getAlertSettings());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    saveAlertSettings(settings);
  }, [settings]);

  const alerts = useMemo(() => {
    if (!settings.enableAlerts) return [];

    const alertsList: Array<{ type: "error" | "warning" | "info"; message: string }> = [];

    // 마진율 경고
    if (result.netMarginRate < settings.minMarginRate && result.netMarginRate >= 0) {
      alertsList.push({
        type: "warning",
        message: `마진율이 ${formatPercent(settings.minMarginRate)} 미만입니다 (현재: ${formatPercent(result.netMarginRate)})`,
      });
    }

    // 수수료율 경고
    const totalFeeRate = result.feeRateTotal * 100;
    if (totalFeeRate > settings.maxFeeRate) {
      alertsList.push({
        type: "warning",
        message: `총 수수료율이 ${formatPercent(settings.maxFeeRate)}를 초과합니다 (현재: ${formatPercent(totalFeeRate)})`,
      });
    }

    // 손실 경고
    if (result.netProfit < 0) {
      alertsList.push({
        type: "error",
        message: "현재 조건으로는 손실이 발생합니다. 판매가나 비용을 조정하세요.",
      });
    }

    // BEP 계산 불가 경고
    if (result.bep === null) {
      alertsList.push({
        type: "error",
        message: "손익분기점을 계산할 수 없습니다. 수수료율이 100% 이상입니다.",
      });
    }

    return alertsList;
  }, [result, settings, status]);

  if (alerts.length === 0 && !showSettings) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">알림</h3>
          {alerts.length > 0 && (
            <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full">
              {alerts.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {showSettings && (
        <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-700 dark:text-gray-300">알림 활성화</label>
            <input
              type="checkbox"
              checked={settings.enableAlerts}
              onChange={(e) =>
                setSettings({ ...settings, enableAlerts: e.target.checked })
              }
              className="rounded"
            />
          </div>
          <div>
            <label className="text-xs text-gray-700 dark:text-gray-300 block mb-1">
              최소 마진율 ({formatPercent(settings.minMarginRate)})
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={settings.minMarginRate}
              onChange={(e) =>
                setSettings({ ...settings, minMarginRate: parseFloat(e.target.value) })
              }
              className="w-full accent-blue-600 dark:accent-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-700 dark:text-gray-300 block mb-1">
              최대 수수료율 ({formatPercent(settings.maxFeeRate)})
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={settings.maxFeeRate}
              onChange={(e) =>
                setSettings({ ...settings, maxFeeRate: parseFloat(e.target.value) })
              }
              className="w-full accent-blue-600 dark:accent-blue-500"
            />
          </div>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="space-y-1.5">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 p-2 rounded text-xs ${
                alert.type === "error"
                  ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                  : alert.type === "warning"
                  ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400"
                  : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400"
              }`}
            >
              {alert.type === "error" ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              ) : alert.type === "warning" ? (
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              )}
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {alerts.length === 0 && settings.enableAlerts && (
        <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-xs text-green-700 dark:text-green-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>모든 지표가 정상 범위입니다</span>
        </div>
      )}
    </div>
  );
}

