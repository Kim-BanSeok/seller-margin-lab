"use client";

import { useState, useEffect } from "react";
import { Save, X, Trash2, Plus } from "lucide-react";
import type { CustomPreset } from "@/lib/storage";
import { getCustomPresets, saveCustomPreset, deleteCustomPreset } from "@/lib/storage";
import { formatPercent } from "@/lib/utils";
import toast from "react-hot-toast";

interface CustomPresetManagerProps {
  currentFees: {
    baseFeeRate: number;
    linkageFeeRate: number;
    shippingFeeRate: number;
    // 하위 호환
    platformFeeRate: number;
    paymentFeeRate: number;
    extraFeeRate: number;
  };
  onSelect: (preset: CustomPreset) => void;
  onClose: () => void;
}

export default function CustomPresetManager({
  currentFees,
  onSelect,
  onClose,
}: CustomPresetManagerProps) {
  const [presets, setPresets] = useState<CustomPreset[]>([]);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [presetName, setPresetName] = useState("");

  useEffect(() => {
    setPresets(getCustomPresets());
  }, []);

  const handleSave = () => {
    if (!presetName.trim()) {
      toast.error("프리셋 이름을 입력하세요");
      return;
    }

    saveCustomPreset({
      name: presetName,
      baseFeeRate: currentFees.baseFeeRate,
      linkageFeeRate: currentFees.linkageFeeRate,
      shippingFeeRate: currentFees.shippingFeeRate,
      // 하위 호환
      platformFeeRate: currentFees.platformFeeRate,
      paymentFeeRate: currentFees.paymentFeeRate,
      extraFeeRate: currentFees.extraFeeRate,
    });

    setPresets(getCustomPresets());
    setPresetName("");
    setShowSaveForm(false);
    toast.success("프리셋이 저장되었습니다");
  };

  const handleDelete = (id: string) => {
    deleteCustomPreset(id);
    setPresets(getCustomPresets());
    toast.success("프리셋이 삭제되었습니다");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">수수료 프리셋 관리</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={() => setShowSaveForm(!showSaveForm)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            현재 수수료 저장
          </button>

          {showSaveForm && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="프리셋 이름 입력"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                onKeyPress={(e) => e.key === "Enter" && handleSave()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setShowSaveForm(false);
                    setPresetName("");
                  }}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {presets.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                저장된 프리셋이 없습니다
              </div>
            ) : (
              presets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-800">{preset.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      기본 {formatPercent((preset.baseFeeRate ?? preset.platformFeeRate) * 100)} · 연동{" "}
                      {formatPercent((preset.linkageFeeRate ?? preset.paymentFeeRate) * 100)} · 배송{" "}
                      {formatPercent((preset.shippingFeeRate ?? 0) * 100)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        onSelect(preset);
                        toast.success("프리셋이 적용되었습니다");
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      적용
                    </button>
                    <button
                      onClick={() => handleDelete(preset.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

