import type { InputData } from "./fees";

export interface CalculationResult {
  gmv: number; // GMV (판매가 + 받은 배송비)
  baseFee: number; // 기본 판매 수수료
  linkageFee: number; // 연동 수수료
  shippingFee: number; // 배송비 수수료
  totalFees: number; // 총 수수료
  vat: number; // 부가세
  expectedReturnCost: number; // 기대 반품 비용
  totalCosts: number; // 총 비용
  netPayout: number; // 정산금액 (판매가 - 수수료)
  netProfit: number; // 순이익 (판매가 - 매입가 - 수수료 - 부가세)
  netMarginRate: number; // 실마진율 (%)
  feeRateTotal: number; // 총 수수료율 (소수)
  bep: number | null; // 손익분기 판매가 (계산불가면 null)
  fixedPerOrder: number; // 주문당 고정비
  // 하위 호환
  platformFee?: number; // 플랫폼 수수료 - 하위 호환
  paymentFee?: number; // 결제 수수료 - 하위 호환
  extraFee?: number; // 추가 수수료 - 하위 호환
}

export type TrafficLightStatus = "RED" | "YELLOW" | "GREEN";

/**
 * 숫자를 0 이상으로 보정 (NaN, Infinity 처리 포함)
 */
function clampNonNegative(value: number): number {
  if (!Number.isFinite(value) || isNaN(value)) return 0;
  return Math.max(0, value);
}

/**
 * 수수료율을 0~1 범위로 보정 (NaN, Infinity 처리 포함)
 */
function clampFeeRate(value: number): number {
  if (!Number.isFinite(value) || isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

/**
 * 부가세 계산
 * 부가세 = (판매가 - 매입가) / ((100 + 부가세율)/100) * (부가세율/100)
 */
function calculateVAT(
  salePrice: number,
  cost: number,
  vatRate: number
): number {
  if (vatRate <= 0 || salePrice <= cost) return 0;
  const vatRateDecimal = vatRate / 100;
  const baseAmount = salePrice - cost;
  const vat = (baseAmount / (1 + vatRateDecimal)) * vatRateDecimal;
  return Math.max(0, vat);
}

/**
 * 실마진 계산
 */
export function calculateMargin(input: InputData): CalculationResult {
  // 입력값 보정
  const salePrice = clampNonNegative(input.salePrice);
  const receivedShipping = clampNonNegative(input.receivedShipping || 0);
  const cost = clampNonNegative(input.cost);
  const shipOut = clampNonNegative(input.shipOut);
  const packaging = clampNonNegative(input.packaging);
  const adCostPerOrder = clampNonNegative(input.adCostPerOrder);
  const otherVariable = clampNonNegative(input.otherVariable);
  const returnRate = clampNonNegative(input.returnRate);
  const returnShipBack = clampNonNegative(input.returnShipBack);
  
  // 수수료율 (하위 호환 고려)
  const baseFeeRate = clampFeeRate(
    input.baseFeeRate ?? input.platformFeeRate ?? 0
  );
  const linkageFeeRate = clampFeeRate(
    input.linkageFeeRate ?? input.paymentFeeRate ?? 0
  );
  const shippingFeeRate = clampFeeRate(input.shippingFeeRate ?? 0);
  
  // 부가세 설정
  const taxType = input.taxType ?? "general";
  const vatRate = taxType === "simple" ? 0 : (input.vatRate ?? 10); // 간이 과세자는 0%, 일반 과세자는 기본 10%

  // GMV (판매가 + 받은 배송비)
  const gmv = salePrice + receivedShipping;

  // 수수료 계산
  const baseFee = salePrice * baseFeeRate; // 기본 판매 수수료
  const linkageFee = salePrice * linkageFeeRate; // 연동 수수료
  const shippingFee = receivedShipping * shippingFeeRate; // 배송비 수수료
  const totalFees = baseFee + linkageFee + shippingFee;

  // 부가세 계산
  const vat = calculateVAT(salePrice, cost, vatRate);

  // 반품 비용 계산
  const returnRateDecimal = returnRate / 100;
  const expectedReturnCost = returnRateDecimal * returnShipBack;

  // 총 비용 계산
  const fixedPerOrder =
    cost +
    shipOut +
    packaging +
    adCostPerOrder +
    otherVariable +
    expectedReturnCost;
  const totalCosts = fixedPerOrder;

  // 정산금액 = 판매가 - 수수료
  const netPayout = salePrice - totalFees;

  // 순이익 = 판매가 - 매입가 - 수수료 - 부가세
  const netProfit = salePrice - cost - totalFees - vat;

  // 실마진율 계산 = (순이익 / 판매가) * 100
  const netMarginRate = salePrice > 0 ? (netProfit / salePrice) * 100 : 0;

  // 총 수수료율
  const feeRateTotal = baseFeeRate + linkageFeeRate;

  // 손익분기 판매가 계산
  let bep: number | null = null;
  if (feeRateTotal < 1) {
    const denominator = 1 - feeRateTotal;
    if (denominator > 0) {
      // 부가세를 고려한 손익분기점 계산
      const costWithVAT = fixedPerOrder + (vatRate > 0 ? calculateVAT(0, cost, vatRate) : 0);
      bep = costWithVAT / denominator;
    }
  }

  return {
    gmv,
    baseFee,
    linkageFee,
    shippingFee,
    totalFees,
    vat,
    expectedReturnCost,
    totalCosts,
    netPayout,
    netProfit,
    netMarginRate,
    feeRateTotal,
    bep,
    fixedPerOrder,
    // 하위 호환
    platformFee: baseFee,
    paymentFee: linkageFee,
    extraFee: 0,
  };
}

/**
 * 신호등 상태 계산
 */
export function getTrafficLightStatus(
  netPayout: number,
  netMarginRate: number
): TrafficLightStatus {
  if (netPayout < 0) {
    return "RED";
  }
  if (netMarginRate < 10) {
    return "YELLOW";
  }
  return "GREEN";
}

