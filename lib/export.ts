import type { CalculationResult } from "./calc";
import type { InputData } from "./fees";
import { formatCurrency, formatPercent } from "./utils";

/**
 * CSV로 데이터 내보내기
 */
export function exportToCSV(
  inputData: InputData,
  result: CalculationResult,
  platform: string,
  filename?: string
): void {
  const rows = [
    ["셀러 실마진 계산 결과"],
    ["플랫폼", platform],
    [""],
    ["=== 입력 정보 ==="],
    ["판매가", formatCurrency(inputData.salePrice)],
    ["원가", formatCurrency(inputData.cost)],
    ["출고 배송비", formatCurrency(inputData.shipOut)],
    ["포장비", formatCurrency(inputData.packaging)],
    ["주문당 광고비", formatCurrency(inputData.adCostPerOrder)],
    ["기타 변동비", formatCurrency(inputData.otherVariable)],
    ["반품율", `${inputData.returnRate}%`],
    ["반품 배송비", formatCurrency(inputData.returnShipBack)],
    ["플랫폼 수수료율", `${(inputData.platformFeeRate * 100).toFixed(2)}%`],
    ["결제 수수료율", `${(inputData.paymentFeeRate * 100).toFixed(2)}%`],
    ["추가 수수료율", `${(inputData.extraFeeRate * 100).toFixed(2)}%`],
    [""],
    ["=== 계산 결과 ==="],
    ["매출 (GMV)", formatCurrency(result.gmv)],
    ["플랫폼 수수료", formatCurrency(result.platformFee)],
    ["결제 수수료", formatCurrency(result.paymentFee)],
    ["추가 수수료", formatCurrency(result.extraFee)],
    ["총 수수료", formatCurrency(result.totalFees)],
    ["기대 반품 비용", formatCurrency(result.expectedReturnCost)],
    ["총 비용", formatCurrency(result.totalCosts)],
    ["실수령", formatCurrency(result.netPayout)],
    ["실마진율", formatPercent(result.netMarginRate)],
    ["손익분기 판매가 (BEP)", result.bep ? formatCurrency(result.bep) : "계산 불가"],
    [""],
    ["생성일시", new Date().toLocaleString("ko-KR")],
  ];

  const csvContent = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename || `margin-calc-${Date.now()}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 여러 시나리오를 CSV로 내보내기
 */
export function exportScenariosToCSV(
  scenarios: Array<{
    name: string;
    inputData: InputData;
    result: CalculationResult;
    platform: string;
  }>,
  filename?: string
): void {
  const headers = [
    "시나리오명",
    "플랫폼",
    "판매가",
    "원가",
    "총 비용",
    "총 수수료",
    "실수령",
    "실마진율",
    "BEP",
  ];

  const rows = scenarios.map((scenario) => [
    scenario.name,
    scenario.platform,
    formatCurrency(scenario.inputData.salePrice),
    formatCurrency(scenario.inputData.cost),
    formatCurrency(scenario.result.totalCosts),
    formatCurrency(scenario.result.totalFees),
    formatCurrency(scenario.result.netPayout),
    formatPercent(scenario.result.netMarginRate),
    scenario.result.bep ? formatCurrency(scenario.result.bep) : "계산 불가",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
    "",
    `생성일시,${new Date().toLocaleString("ko-KR")}`,
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename || `scenarios-${Date.now()}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

