import type { InputData } from "./fees";
import { calculateMargin } from "./calc";

/**
 * 목표 마진율을 달성하기 위한 최소 판매가 계산
 */
export function calculateTargetPrice(
  inputData: Omit<InputData, "salePrice">,
  targetMarginRate: number
): number {
  const targetMarginDecimal = targetMarginRate / 100;
  const feeRateTotal =
    inputData.platformFeeRate + inputData.paymentFeeRate + inputData.extraFeeRate;
  const shippingFeeRate = inputData.shippingFeeRate || 0;

  // 총 비용 계산 (판매가 제외)
  const returnRateDecimal = inputData.returnRate / 100;
  const expectedReturnCost = returnRateDecimal * inputData.returnShipBack;
  const fixedPerOrder =
    inputData.cost +
    inputData.shipOut +
    inputData.packaging +
    inputData.adCostPerOrder +
    inputData.otherVariable +
    expectedReturnCost;
  
  // 받은 배송비에서 배송비 수수료 차감
  const receivedShippingNet = (inputData.receivedShipping || 0) * (1 - shippingFeeRate);

  // 목표 마진율 달성 공식:
  // netPayout = (salePrice + receivedShippingNet) * targetMarginDecimal
  // netPayout = salePrice + receivedShippingNet - (salePrice * feeRateTotal) - fixedPerOrder
  // (salePrice + receivedShippingNet) * targetMarginDecimal = salePrice + receivedShippingNet - (salePrice * feeRateTotal) - fixedPerOrder
  // salePrice * targetMarginDecimal + receivedShippingNet * targetMarginDecimal = salePrice * (1 - feeRateTotal) + receivedShippingNet - fixedPerOrder
  // salePrice * (targetMarginDecimal - 1 + feeRateTotal) = -receivedShippingNet * targetMarginDecimal + receivedShippingNet - fixedPerOrder
  // salePrice = (receivedShippingNet * (1 - targetMarginDecimal) - fixedPerOrder) / (1 - feeRateTotal - targetMarginDecimal)

  const denominator = 1 - feeRateTotal - targetMarginDecimal;
  if (denominator <= 0) {
    return 0; // 계산 불가
  }

  const numerator = receivedShippingNet * (1 - targetMarginDecimal) - fixedPerOrder;
  return numerator / denominator;
}

/**
 * 판매량별 수익 시뮬레이션
 */
export interface SalesSimulationResult {
  quantity: number;
  totalRevenue: number; // 총 매출
  totalCosts: number; // 총 비용
  totalFees: number; // 총 수수료
  netProfit: number; // 순이익
  averageProfitPerUnit: number; // 단위당 평균 이익
}

export function simulateSales(
  inputData: InputData,
  quantity: number
): SalesSimulationResult {
  const result = calculateMargin(inputData);
  const unitPrice = inputData.salePrice;

  const totalRevenue = unitPrice * quantity;
  const totalFees = result.totalFees * quantity;
  const totalCosts = result.totalCosts * quantity;
  const netProfit = totalRevenue - totalFees - totalCosts;
  const averageProfitPerUnit = quantity > 0 ? netProfit / quantity : 0;

  return {
    quantity,
    totalRevenue,
    totalCosts,
    totalFees,
    netProfit,
    averageProfitPerUnit,
  };
}

/**
 * 월별/연간 수익 예측
 */
export interface MonthlyForecast {
  month: number;
  salesQuantity: number;
  revenue: number;
  costs: number;
  fees: number;
  profit: number;
}

export interface AnnualForecast {
  monthly: MonthlyForecast[];
  totalRevenue: number;
  totalCosts: number;
  totalFees: number;
  totalProfit: number;
  averageMonthlyProfit: number;
}

export function calculateAnnualForecast(
  inputData: InputData,
  monthlySales: number[]
): AnnualForecast {
  const monthly: MonthlyForecast[] = monthlySales.map((quantity, index) => {
    const sim = simulateSales(inputData, quantity);
    return {
      month: index + 1,
      salesQuantity: quantity,
      revenue: sim.totalRevenue,
      costs: sim.totalCosts,
      fees: sim.totalFees,
      profit: sim.netProfit,
    };
  });

  const totalRevenue = monthly.reduce((sum, m) => sum + m.revenue, 0);
  const totalCosts = monthly.reduce((sum, m) => sum + m.costs, 0);
  const totalFees = monthly.reduce((sum, m) => sum + m.fees, 0);
  const totalProfit = monthly.reduce((sum, m) => sum + m.profit, 0);
  const averageMonthlyProfit = totalProfit / monthly.length;

  return {
    monthly,
    totalRevenue,
    totalCosts,
    totalFees,
    totalProfit,
    averageMonthlyProfit,
  };
}

/**
 * ROI 계산
 */
export interface ROIResult {
  initialInvestment: number;
  monthlyProfit: number;
  annualProfit: number;
  roi: number; // ROI (%)
  paybackMonths: number; // 회수 기간 (월)
  paybackDays: number; // 회수 기간 (일)
}

export function calculateROI(
  inputData: InputData,
  initialInvestment: number,
  monthlySalesQuantity: number
): ROIResult {
  const monthlySim = simulateSales(inputData, monthlySalesQuantity);
  const monthlyProfit = monthlySim.netProfit;
  const annualProfit = monthlyProfit * 12;

  const roi = initialInvestment > 0 ? (annualProfit / initialInvestment) * 100 : 0;
  const paybackMonths = monthlyProfit > 0 ? initialInvestment / monthlyProfit : Infinity;
  const paybackDays = paybackMonths * 30;

  return {
    initialInvestment,
    monthlyProfit,
    annualProfit,
    roi,
    paybackMonths,
    paybackDays,
  };
}

