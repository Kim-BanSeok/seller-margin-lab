export type Platform =
  | "smartstore"
  | "coupang"
  | "11st"
  | "gmarket"
  | "auction"
  | "interpark"
  | "ohouse"
  | "cafe24"
  | "domeggook"
  | "other";

export interface FeePreset {
  baseFeeRate: number; // 기본 판매 수수료율 (카테고리 수수료) (소수)
  linkageFeeRate: number; // 연동 수수료율 (소수) - 네이버 쇼핑 노출 시
  shippingFeeRate: number; // 배송비 수수료율 (소수)
  // 하위 호환성을 위한 필드
  platformFeeRate?: number; // 플랫폼 수수료율 (소수) - 하위 호환
  paymentFeeRate?: number; // 결제 수수료율 (소수) - 하위 호환
  extraFeeRate?: number; // 추가 수수료율 (소수) - 하위 호환
}

export const FEE_PRESETS: Record<Platform, FeePreset> = {
  smartstore: {
    baseFeeRate: 0.0363, // 3.63% (기본 판매 수수료)
    linkageFeeRate: 0.03, // 3% (연동 수수료)
    shippingFeeRate: 0.0363, // 3.63% (배송비 수수료)
    // 하위 호환
    platformFeeRate: 0.0363,
    paymentFeeRate: 0.03,
    extraFeeRate: 0,
  },
  coupang: {
    baseFeeRate: 0.1188, // 11.88% (기본 판매 수수료)
    linkageFeeRate: 0, // 연동 수수료 없음
    shippingFeeRate: 0.033, // 3.3% (배송비 수수료)
    // 하위 호환
    platformFeeRate: 0.1188,
    paymentFeeRate: 0,
    extraFeeRate: 0,
  },
  "11st": {
    baseFeeRate: 0.13, // 13% (기본 판매 수수료)
    linkageFeeRate: 0.02, // 2% (연동 수수료)
    shippingFeeRate: 0.033, // 3.3% (배송비 수수료)
    // 하위 호환
    platformFeeRate: 0.13,
    paymentFeeRate: 0.02,
    extraFeeRate: 0,
  },
  gmarket: {
    baseFeeRate: 0.13, // 13% (기본 판매 수수료)
    linkageFeeRate: 0.02, // 2% (연동 수수료)
    shippingFeeRate: 0.033, // 3.3% (배송비 수수료)
    // 하위 호환
    platformFeeRate: 0.13,
    paymentFeeRate: 0.02,
    extraFeeRate: 0,
  },
  auction: {
    baseFeeRate: 0.13, // 13% (기본 판매 수수료)
    linkageFeeRate: 0.02, // 2% (연동 수수료)
    shippingFeeRate: 0.033, // 3.3% (배송비 수수료)
    // 하위 호환
    platformFeeRate: 0.13,
    paymentFeeRate: 0.02,
    extraFeeRate: 0,
  },
  interpark: {
    baseFeeRate: 0.13, // 13% (기본 판매 수수료)
    linkageFeeRate: 0.02, // 2% (연동 수수료)
    shippingFeeRate: 0.033, // 3.3% (배송비 수수료)
    // 하위 호환
    platformFeeRate: 0.13,
    paymentFeeRate: 0.02,
    extraFeeRate: 0,
  },
  ohouse: {
    baseFeeRate: 0.11, // 11% (기타 마켓 평균)
    linkageFeeRate: 0.02, // 2%
    shippingFeeRate: 0.033, // 3.3%
    // 하위 호환
    platformFeeRate: 0.11,
    paymentFeeRate: 0.02,
    extraFeeRate: 0,
  },
  cafe24: {
    baseFeeRate: 0.03, // 3%
    linkageFeeRate: 0, // 연동 수수료 없음
    shippingFeeRate: 0, // 배송비 수수료 없음
    // 하위 호환
    platformFeeRate: 0.03,
    paymentFeeRate: 0.018,
    extraFeeRate: 0,
  },
  domeggook: {
    baseFeeRate: 0.05, // 5%
    linkageFeeRate: 0, // 연동 수수료 없음
    shippingFeeRate: 0.033, // 3.3%
    // 하위 호환
    platformFeeRate: 0.05,
    paymentFeeRate: 0,
    extraFeeRate: 0,
  },
  other: {
    baseFeeRate: 0, // 사용자 입력
    linkageFeeRate: 0,
    shippingFeeRate: 0,
    // 하위 호환
    platformFeeRate: 0,
    paymentFeeRate: 0,
    extraFeeRate: 0,
  },
};

export const PLATFORM_NAMES: Record<Platform, string> = {
  smartstore: "네이버 스마트스토어",
  coupang: "쿠팡",
  "11st": "11번가",
  gmarket: "지마켓",
  auction: "옥션",
  interpark: "인터파크",
  ohouse: "오늘의집",
  cafe24: "카페24",
  domeggook: "도매꾹",
  other: "기타",
};

export type TaxType = "general" | "simple"; // 일반 과세자, 간이 과세자

export interface InputData {
  salePrice: number; // 판매가
  receivedShipping: number; // 받은 배송비 (고객이 지불한 배송비)
  cost: number; // 원가 (매입가)
  shipOut: number; // 출고 배송비 (보낸 배송비)
  packaging: number; // 포장비
  adCostPerOrder: number; // 주문당 광고비
  otherVariable: number; // 기타 변동비
  returnRate: number; // 반품율 (%)
  returnShipBack: number; // 반품 배송비
  // 수수료
  baseFeeRate: number; // 기본 판매 수수료율 (카테고리 수수료) (소수)
  linkageFeeRate: number; // 연동 수수료율 (소수)
  shippingFeeRate: number; // 배송비 수수료율 (소수)
  // 부가세
  taxType: TaxType; // 과세 유형
  vatRate: number; // 부가세율 (%) - 일반 과세자: 10%, 간이 과세자: 0%
  // 하위 호환
  platformFeeRate?: number; // 플랫폼 수수료율 (소수) - 하위 호환
  paymentFeeRate?: number; // 결제 수수료율 (소수) - 하위 호환
  extraFeeRate?: number; // 추가 수수료율 (소수) - 하위 호환
}

