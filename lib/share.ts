import type { Platform } from "./fees";
import type { InputData } from "./fees";

export interface AppState {
  platform: Platform;
  inputData: InputData;
}

/**
 * 상태를 URL 쿼리 파라미터로 직렬화
 */
export function serializeState(state: AppState): string {
  const params = new URLSearchParams();
  params.set("platform", state.platform);
  params.set("salePrice", state.inputData.salePrice.toString());
  params.set("receivedShipping", (state.inputData.receivedShipping || 0).toString());
  params.set("cost", state.inputData.cost.toString());
  params.set("shipOut", state.inputData.shipOut.toString());
  params.set("packaging", state.inputData.packaging.toString());
  params.set("adCostPerOrder", state.inputData.adCostPerOrder.toString());
  params.set("otherVariable", state.inputData.otherVariable.toString());
  params.set("returnRate", state.inputData.returnRate.toString());
  params.set("returnShipBack", state.inputData.returnShipBack.toString());
  params.set("baseFeeRate", (state.inputData.baseFeeRate ?? 0).toString());
  params.set("linkageFeeRate", (state.inputData.linkageFeeRate ?? 0).toString());
  params.set("shippingFeeRate", (state.inputData.shippingFeeRate ?? 0).toString());
  params.set("taxType", state.inputData.taxType ?? "general");
  params.set("vatRate", (state.inputData.vatRate ?? 10).toString());
  // 하위 호환
  if (state.inputData.platformFeeRate !== undefined) {
    params.set("platformFeeRate", state.inputData.platformFeeRate.toString());
  }
  if (state.inputData.paymentFeeRate !== undefined) {
    params.set("paymentFeeRate", state.inputData.paymentFeeRate.toString());
  }
  if (state.inputData.extraFeeRate !== undefined) {
    params.set("extraFeeRate", state.inputData.extraFeeRate.toString());
  }
  return params.toString();
}

/**
 * URL 쿼리 파라미터에서 상태 복원
 */
export function deserializeState(searchParams: URLSearchParams): AppState | null {
  try {
    const platform = searchParams.get("platform");
    const validPlatforms: Platform[] = [
      "smartstore",
      "coupang",
      "11st",
      "gmarket",
      "auction",
      "interpark",
      "ohouse",
      "cafe24",
      "domeggook",
      "other",
    ];
    if (!platform || !validPlatforms.includes(platform as Platform)) {
      return null;
    }

    const parseNumber = (key: string, defaultValue: number = 0): number => {
      const value = searchParams.get(key);
      if (value === null) return defaultValue;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    };

    const inputData: InputData = {
      salePrice: parseNumber("salePrice"),
      receivedShipping: parseNumber("receivedShipping"),
      cost: parseNumber("cost"),
      shipOut: parseNumber("shipOut"),
      packaging: parseNumber("packaging"),
      adCostPerOrder: parseNumber("adCostPerOrder"),
      otherVariable: parseNumber("otherVariable"),
      returnRate: parseNumber("returnRate"),
      returnShipBack: parseNumber("returnShipBack"),
      baseFeeRate: parseNumber("baseFeeRate"),
      linkageFeeRate: parseNumber("linkageFeeRate"),
      shippingFeeRate: parseNumber("shippingFeeRate"),
      taxType: (searchParams.get("taxType") as "general" | "simple") || "general",
      vatRate: parseNumber("vatRate", 10),
      // 하위 호환
      platformFeeRate: parseNumber("platformFeeRate"),
      paymentFeeRate: parseNumber("paymentFeeRate"),
      extraFeeRate: parseNumber("extraFeeRate"),
    };

    return {
      platform: platform as Platform,
      inputData,
    };
  } catch {
    return null;
  }
}

