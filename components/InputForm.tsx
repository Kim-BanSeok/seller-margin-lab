"use client";

import { useState } from "react";
import {
  DollarSign,
  Package,
  Truck,
  Box,
  Megaphone,
  MoreHorizontal,
  Percent,
  CreditCard,
  Plus,
  Minus,
  Zap,
} from "lucide-react";
import type { InputData } from "@/lib/fees";
import type { TaxType } from "@/lib/fees";
import Tooltip from "./Tooltip";

interface InputFormProps {
  inputData: InputData;
  onInputChange: (field: keyof InputData, value: number | "general" | "simple") => void;
}

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: React.ReactNode;
  tooltip: string;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
  showSlider?: boolean;
  sliderMin?: number;
  sliderMax?: number;
  quickButtons?: number[];
}

function InputField({
  label,
  value,
  onChange,
  icon,
  tooltip,
  step = 1,
  min = 0,
  max,
  suffix = "원",
  showSlider = false,
  sliderMin = 0,
  sliderMax = 100000,
  quickButtons,
}: InputFieldProps) {
  const handleIncrement = () => {
    const newValue = value + step;
    onChange(max !== undefined ? Math.min(newValue, max) : newValue);
  };

  const handleDecrement = () => {
    const newValue = value - step;
    onChange(Math.max(newValue, min));
  };

  const formatDisplayValue = (val: number): string => {
    if (suffix === "%") {
      return val.toFixed(1);
    }
    return val.toLocaleString("ko-KR");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {icon}
          <span>{label}</span>
          <Tooltip content={tooltip} />
        </label>
      </div>

      {/* 빠른 입력 버튼 */}
      {quickButtons && quickButtons.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {quickButtons.map((btnValue) => (
            <button
              key={btnValue}
              onClick={() => onChange(btnValue)}
              className={`px-2 py-0.5 text-xs rounded transition-all ${
                value === btnValue
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              type="button"
            >
              {suffix === "%" ? `${btnValue}%` : `${(btnValue / 10000).toFixed(0)}만`}
            </button>
          ))}
        </div>
      )}

      {/* 슬라이더 (항상 표시) */}
      {showSlider && (
        <div className="mb-2">
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                ((value - sliderMin) / (sliderMax - sliderMin)) * 100
              }%, #e5e7eb ${((value - sliderMin) / (sliderMax - sliderMin)) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{sliderMin.toLocaleString()}</span>
            <span className="font-medium text-blue-600">{formatDisplayValue(value)}</span>
            <span>{sliderMax.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* 입력 필드 */}
      <div className="flex gap-1.5">
        <button
          onClick={handleDecrement}
          className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded transition-colors flex-shrink-0"
          type="button"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={value ? formatDisplayValue(value) : ""}
            onChange={(e) => {
              // 숫자만 추출 (천 단위 구분 제거)
              const cleaned = e.target.value.replace(/[^\d.]/g, "");
              const numValue = parseFloat(cleaned) || 0;
              const clampedValue =
                max !== undefined
                  ? Math.min(Math.max(numValue, min), max)
                  : Math.max(numValue, min);
              onChange(clampedValue);
            }}
            onBlur={(e) => {
              // 포커스 아웃 시 포맷팅
              if (value) {
                e.target.value = formatDisplayValue(value);
              }
            }}
            className="w-full px-3 sm:px-3 py-2.5 sm:py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-right text-sm sm:text-sm font-medium"
            placeholder="0"
          />
          {suffix && value > 0 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        <button
          onClick={handleIncrement}
          className="px-2.5 sm:px-2 py-2.5 sm:py-1.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded transition-colors flex-shrink-0 min-w-[44px] sm:min-w-0"
          type="button"
        >
          <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function InputForm({ inputData, onInputChange }: InputFormProps) {
  const handleChange = (field: keyof InputData, value: number | "general" | "simple") => {
    if (field === "taxType") {
      onInputChange(field, value as "general" | "simple");
    } else {
      onInputChange(field, value as number);
    }
  };

  return (
    <div className="space-y-3 animate-slide-up">
      {/* 판매가 */}
      <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <InputField
          label="판매가"
          value={inputData.salePrice}
          onChange={(value) => handleChange("salePrice", value)}
          icon={<DollarSign className="w-5 h-5 text-blue-600" />}
          tooltip="상품의 판매 가격입니다."
          step={1000}
          showSlider={true}
          sliderMin={0}
          sliderMax={500000}
          quickButtons={[10000, 20000, 30000, 50000, 100000]}
        />
      </div>

      {/* 받은 배송비 */}
      <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
        <InputField
          label="받은 배송비"
          value={inputData.receivedShipping || 0}
          onChange={(value) => handleChange("receivedShipping", value)}
          icon={<Truck className="w-4 h-4 text-green-600" />}
          tooltip="고객이 지불한 배송비입니다."
          step={500}
          showSlider={true}
          sliderMin={0}
          sliderMax={20000}
          quickButtons={[2500, 3000, 3500, 4000, 5000]}
        />
      </div>

      {/* 비용 항목 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-800">비용 항목</h3>
        </div>

        <div className="space-y-3">
          <InputField
            label="원가"
            value={inputData.cost}
            onChange={(value) => handleChange("cost", value)}
            icon={<Package className="w-4 h-4 text-gray-600" />}
            tooltip="상품의 원가(구매가)입니다."
            step={1000}
            showSlider={true}
            sliderMin={0}
            sliderMax={300000}
            quickButtons={[5000, 10000, 20000, 50000, 100000]}
          />

          <InputField
            label="출고 배송비"
            value={inputData.shipOut}
            onChange={(value) => handleChange("shipOut", value)}
            icon={<Truck className="w-4 h-4 text-gray-600" />}
            tooltip="고객에게 상품을 배송하는 데 드는 비용입니다."
            step={500}
            showSlider={true}
            sliderMin={0}
            sliderMax={20000}
            quickButtons={[2500, 3000, 3500, 4000, 5000]}
          />

          <InputField
            label="포장비"
            value={inputData.packaging}
            onChange={(value) => handleChange("packaging", value)}
            icon={<Box className="w-4 h-4 text-gray-600" />}
            tooltip="상품 포장에 드는 비용입니다."
            step={100}
            showSlider={true}
            sliderMin={0}
            sliderMax={10000}
            quickButtons={[500, 1000, 2000, 3000, 5000]}
          />

          <InputField
            label="주문당 광고비"
            value={inputData.adCostPerOrder}
            onChange={(value) => handleChange("adCostPerOrder", value)}
            icon={<Megaphone className="w-4 h-4 text-gray-600" />}
            tooltip="한 주문당 평균 광고 비용입니다."
            step={100}
            showSlider={true}
            sliderMin={0}
            sliderMax={50000}
            quickButtons={[1000, 2000, 5000, 10000, 20000]}
          />

          <InputField
            label="기타 변동비"
            value={inputData.otherVariable}
            onChange={(value) => handleChange("otherVariable", value)}
            icon={<MoreHorizontal className="w-4 h-4 text-gray-600" />}
            tooltip="기타 변동 비용입니다."
            step={100}
            showSlider={true}
            sliderMin={0}
            sliderMax={50000}
            quickButtons={[1000, 2000, 5000, 10000]}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="반품율"
              value={inputData.returnRate}
              onChange={(value) => handleChange("returnRate", value)}
              icon={<Percent className="w-4 h-4 text-gray-600" />}
              tooltip="예상 반품율(%)입니다."
              step={0.5}
              min={0}
              max={100}
              suffix="%"
              quickButtons={[1, 3, 5, 10, 15]}
            />

            <InputField
              label="반품 배송비"
              value={inputData.returnShipBack}
              onChange={(value) => handleChange("returnShipBack", value)}
              icon={<Truck className="w-4 h-4 text-gray-600" />}
              tooltip="반품 시 발생하는 배송비입니다."
              step={500}
              showSlider={true}
              sliderMin={0}
              sliderMax={20000}
              quickButtons={[2500, 3000, 3500, 4000, 5000]}
            />
          </div>
        </div>
      </div>

      {/* 수수료 항목 */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-800">수수료 항목</h3>
        </div>

        <div className="space-y-3">
          <InputField
            label="기본 판매 수수료율"
            value={(inputData.baseFeeRate ?? inputData.platformFeeRate ?? 0) * 100}
            onChange={(value) => handleChange("baseFeeRate", value / 100)}
            icon={<Percent className="w-4 h-4 text-blue-600" />}
            tooltip="각 플랫폼별 카테고리 수수료율(%)입니다."
            step={0.1}
            min={0}
            max={100}
            suffix="%"
            showSlider={true}
            sliderMin={0}
            sliderMax={20}
            quickButtons={[3, 5, 10, 13, 15]}
          />

          <InputField
            label="연동 수수료율"
            value={(inputData.linkageFeeRate ?? inputData.paymentFeeRate ?? 0) * 100}
            onChange={(value) => handleChange("linkageFeeRate", value / 100)}
            icon={<CreditCard className="w-4 h-4 text-blue-600" />}
            tooltip="네이버 쇼핑에 노출된 상품이 판매된 경우 발생하는 검색 광고비(%)입니다."
            step={0.1}
            min={0}
            max={100}
            suffix="%"
            showSlider={true}
            sliderMin={0}
            sliderMax={5}
            quickButtons={[0, 2, 3, 4, 5]}
          />

          <InputField
            label="배송비 수수료율"
            value={(inputData.shippingFeeRate ?? 0) * 100}
            onChange={(value) => handleChange("shippingFeeRate", value / 100)}
            icon={<Truck className="w-4 h-4 text-blue-600" />}
            tooltip="마켓 배송비 수수료율(%)입니다."
            step={0.1}
            min={0}
            max={100}
            suffix="%"
            showSlider={true}
            sliderMin={0}
            sliderMax={10}
            quickButtons={[0, 3.3, 3.63, 4, 5]}
          />
        </div>
      </div>

      {/* 부가세 설정 */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Percent className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-800">부가세 설정</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              과세 유형
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleChange("taxType", "general")}
                className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                  (inputData.taxType ?? "general") === "general"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                일반 과세자
              </button>
              <button
                type="button"
                onClick={() => {
                  handleChange("taxType", "simple");
                  handleChange("vatRate", 0);
                }}
                className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                  (inputData.taxType ?? "general") === "simple"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                간이 과세자
              </button>
            </div>
          </div>

          {(inputData.taxType ?? "general") === "general" && (
            <InputField
              label="부가세율"
              value={inputData.vatRate ?? 10}
              onChange={(value) => handleChange("vatRate", value)}
              icon={<Percent className="w-4 h-4 text-green-600" />}
              tooltip="일반 과세자의 부가세율(%)입니다. 기본값은 10%입니다."
              step={0.1}
              min={0}
              max={100}
              suffix="%"
              showSlider={true}
              sliderMin={0}
              sliderMax={20}
              quickButtons={[10]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
