import type { InputData } from "./fees";
import type { Platform } from "./fees";

export interface SavedCalculation {
  id: string;
  name: string;
  platform: Platform;
  inputData: InputData;
  timestamp: number;
  result?: {
    netPayout: number;
    netMarginRate: number;
  };
}

export interface CustomPreset {
  id: string;
  name: string;
  platformFeeRate: number;
  paymentFeeRate: number;
  extraFeeRate: number;
  timestamp: number;
}

const STORAGE_KEYS = {
  CALCULATIONS: "seller-margin-calculations",
  PRESETS: "seller-margin-presets",
  ALERT_SETTINGS: "seller-margin-alert-settings",
};

// 계산 히스토리 관리
export function saveCalculation(calculation: Omit<SavedCalculation, "id" | "timestamp">): string {
  const id = `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const saved: SavedCalculation = {
    ...calculation,
    id,
    timestamp: Date.now(),
  };

  const existing = getSavedCalculations();
  existing.unshift(saved);
  // 최대 50개까지만 저장
  const limited = existing.slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(limited));
  return id;
}

export function getSavedCalculations(): SavedCalculation[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CALCULATIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deleteCalculation(id: string): void {
  const existing = getSavedCalculations();
  const filtered = existing.filter((calc) => calc.id !== id);
  localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(filtered));
}

export function clearAllCalculations(): void {
  localStorage.removeItem(STORAGE_KEYS.CALCULATIONS);
}

// 커스텀 프리셋 관리
export function saveCustomPreset(preset: Omit<CustomPreset, "id" | "timestamp">): string {
  const id = `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const saved: CustomPreset = {
    ...preset,
    id,
    timestamp: Date.now(),
  };

  const existing = getCustomPresets();
  existing.unshift(saved);
  const limited = existing.slice(0, 20);
  localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(limited));
  return id;
}

export function getCustomPresets(): CustomPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRESETS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deleteCustomPreset(id: string): void {
  const existing = getCustomPresets();
  const filtered = existing.filter((preset) => preset.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(filtered));
}

// 알림 설정 관리
export interface AlertSettings {
  minMarginRate: number;
  maxFeeRate: number;
  enableAlerts: boolean;
}

export function getAlertSettings(): AlertSettings {
  if (typeof window === "undefined") {
    return {
      minMarginRate: 10,
      maxFeeRate: 50,
      enableAlerts: true,
    };
  }
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ALERT_SETTINGS);
    return data ? JSON.parse(data) : { minMarginRate: 10, maxFeeRate: 50, enableAlerts: true };
  } catch {
    return { minMarginRate: 10, maxFeeRate: 50, enableAlerts: true };
  }
}

export function saveAlertSettings(settings: AlertSettings): void {
  localStorage.setItem(STORAGE_KEYS.ALERT_SETTINGS, JSON.stringify(settings));
}

