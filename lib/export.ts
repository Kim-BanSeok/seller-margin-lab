import type { CalculationResult } from "./calc";
import type { InputData } from "./fees";
import { formatCurrency, formatPercent } from "./utils";

/**
 * CSV용 숫자 포맷팅 (천 단위 구분자 없이 숫자만)
 */
function formatNumberForCSV(value: number): string {
  return Math.round(value).toString();
}

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
    ["판매가", formatNumberForCSV(inputData.salePrice)],
    ["원가", formatNumberForCSV(inputData.cost)],
    ["출고 배송비", formatNumberForCSV(inputData.shipOut)],
    ["포장비", formatNumberForCSV(inputData.packaging)],
    ["주문당 광고비", formatNumberForCSV(inputData.adCostPerOrder)],
    ["기타 변동비", formatNumberForCSV(inputData.otherVariable)],
    ["반품율", `${inputData.returnRate}%`],
    ["반품 배송비", formatNumberForCSV(inputData.returnShipBack)],
    ["플랫폼 수수료율", `${(inputData.platformFeeRate * 100).toFixed(2)}%`],
    ["결제 수수료율", `${(inputData.paymentFeeRate * 100).toFixed(2)}%`],
    ["추가 수수료율", `${(inputData.extraFeeRate * 100).toFixed(2)}%`],
    [""],
    ["=== 계산 결과 ==="],
    ["매출 (GMV)", formatNumberForCSV(result.gmv)],
    ["기본 판매 수수료", formatNumberForCSV(result.baseFee)],
    ["연동 수수료", formatNumberForCSV(result.linkageFee)],
    ["배송비 수수료", formatNumberForCSV(result.shippingFee)],
    ["총 수수료", formatNumberForCSV(result.totalFees)],
    ["부가세", formatNumberForCSV(result.vat)],
    ["기대 반품 비용", formatNumberForCSV(result.expectedReturnCost)],
    ["총 비용", formatNumberForCSV(result.totalCosts)],
    ["정산금액", formatNumberForCSV(result.netPayout)],
    ["순이익", formatNumberForCSV(result.netProfit)],
    ["실마진율", formatPercent(result.netMarginRate)],
    ["손익분기 판매가 (BEP)", result.bep ? formatNumberForCSV(result.bep) : "계산 불가"],
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
    formatNumberForCSV(scenario.inputData.salePrice),
    formatNumberForCSV(scenario.inputData.cost),
    formatNumberForCSV(scenario.result.totalCosts),
    formatNumberForCSV(scenario.result.totalFees),
    formatNumberForCSV(scenario.result.netPayout),
    formatPercent(scenario.result.netMarginRate),
    scenario.result.bep ? formatNumberForCSV(scenario.result.bep) : "계산 불가",
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

