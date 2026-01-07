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
  // 새로운 수수료 구조
  baseFeeRate: number;
  linkageFeeRate: number;
  shippingFeeRate: number;
  // 하위 호환성을 위한 기존 필드
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

// LocalStorage 사용 가능 여부 확인
function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// 계산 히스토리 관리
export function saveCalculation(calculation: Omit<SavedCalculation, "id" | "timestamp">): string {
  if (!isLocalStorageAvailable()) {
    throw new Error("LocalStorage를 사용할 수 없습니다. 브라우저 설정을 확인해주세요.");
  }

  const id = `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const saved: SavedCalculation = {
    ...calculation,
    id,
    timestamp: Date.now(),
  };

  try {
    const existing = getSavedCalculations();
    existing.unshift(saved);
    // 최대 50개까지만 저장
    const limited = existing.slice(0, 50);
    const data = JSON.stringify(limited);
    
    // 용량 체크 (대략 5MB 제한)
    if (data.length > 4 * 1024 * 1024) {
      // 오래된 항목부터 삭제
      const trimmed = existing.slice(0, 30);
      localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(trimmed));
      throw new Error("저장 공간이 부족합니다. 일부 오래된 데이터가 삭제되었습니다.");
    }
    
    localStorage.setItem(STORAGE_KEYS.CALCULATIONS, data);
    return id;
  } catch (error) {
    if (error instanceof Error && error.message.includes("QuotaExceededError")) {
      throw new Error("저장 공간이 부족합니다. 일부 데이터를 삭제한 후 다시 시도해주세요.");
    }
    throw error;
  }
}

export function getSavedCalculations(): SavedCalculation[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CALCULATIONS);
    if (!data) return [];
    const parsed = JSON.parse(data);
    // 배열인지 확인
    if (!Array.isArray(parsed)) return [];
    // 유효한 데이터만 필터링
    return parsed.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.timestamp === "number"
    );
  } catch (error) {
    console.error("히스토리 로드 실패:", error);
    // 손상된 데이터 정리
    try {
      localStorage.removeItem(STORAGE_KEYS.CALCULATIONS);
    } catch {
      // 무시
    }
    return [];
  }
}

export function deleteCalculation(id: string): void {
  if (!isLocalStorageAvailable()) return;
  try {
    const existing = getSavedCalculations();
    const filtered = existing.filter((calc) => calc.id !== id);
    localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(filtered));
  } catch (error) {
    console.error("계산 삭제 실패:", error);
  }
}

export function clearAllCalculations(): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.CALCULATIONS);
  } catch (error) {
    console.error("전체 삭제 실패:", error);
  }
}

// 커스텀 프리셋 관리
export function saveCustomPreset(preset: Omit<CustomPreset, "id" | "timestamp">): string {
  if (!isLocalStorageAvailable()) {
    throw new Error("LocalStorage를 사용할 수 없습니다. 브라우저 설정을 확인해주세요.");
  }

  const id = `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const saved: CustomPreset = {
    ...preset,
    id,
    timestamp: Date.now(),
  };

  try {
    const existing = getCustomPresets();
    existing.unshift(saved);
    const limited = existing.slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(limited));
    return id;
  } catch (error) {
    if (error instanceof Error && error.message.includes("QuotaExceededError")) {
      throw new Error("저장 공간이 부족합니다.");
    }
    throw error;
  }
}

export function getCustomPresets(): CustomPreset[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRESETS);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.timestamp === "number"
    );
  } catch (error) {
    console.error("프리셋 로드 실패:", error);
    try {
      localStorage.removeItem(STORAGE_KEYS.PRESETS);
    } catch {
      // 무시
    }
    return [];
  }
}

export function deleteCustomPreset(id: string): void {
  if (!isLocalStorageAvailable()) return;
  try {
    const existing = getCustomPresets();
    const filtered = existing.filter((preset) => preset.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(filtered));
  } catch (error) {
    console.error("프리셋 삭제 실패:", error);
  }
}

// 알림 설정 관리
export interface AlertSettings {
  minMarginRate: number;
  maxFeeRate: number;
  enableAlerts: boolean;
}

export function getAlertSettings(): AlertSettings {
  const defaultValue = {
    minMarginRate: 10,
    maxFeeRate: 50,
    enableAlerts: true,
  };

  if (!isLocalStorageAvailable()) return defaultValue;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ALERT_SETTINGS);
    if (!data) return defaultValue;
    const parsed = JSON.parse(data);
    // 유효성 검사
    if (
      typeof parsed !== "object" ||
      typeof parsed.minMarginRate !== "number" ||
      typeof parsed.maxFeeRate !== "number" ||
      typeof parsed.enableAlerts !== "boolean"
    ) {
      return defaultValue;
    }
    return parsed;
  } catch (error) {
    console.error("알림 설정 로드 실패:", error);
    return defaultValue;
  }
}

export function saveAlertSettings(settings: AlertSettings): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.ALERT_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("알림 설정 저장 실패:", error);
  }
}

