# 셀러 실마진 계산기

온라인 셀러를 위한 실마진 계산 · 플랫폼 수수료 비교 · 손익분기 분석 도구 (Smartstore, Coupang)

## 프로젝트 소개

이 도구는 온라인 셀러가 상품 판매 시 실제 수익성을 정확히 계산할 수 있도록 도와주는 MVP(Minimum Viable Product)입니다. 스마트스토어와 쿠팡 두 플랫폼을 지원하며, 판매가, 비용, 수수료를 입력하면 실수령, 실마진율, 손익분기 판매가를 즉시 계산합니다.

## 주요 기능

- **플랫폼 지원**: 스마트스토어, 쿠팡
- **실시간 계산**: 입력값 변경 시 즉시 결과 갱신
- **수수료 프리셋**: 플랫폼별 기본 수수료 자동 적용 (사용자 수정 가능)
- **상세 내역**: 매출, 수수료, 비용 항목별 breakdown 제공
- **신호등 상태**: 수익성 상태를 RED/YELLOW/GREEN으로 시각화
- **링크 공유**: 현재 계산 상태를 URL로 공유하여 동일한 조건으로 복원 가능
- **반응형 디자인**: 모바일 우선, 데스크톱 2열 레이아웃

## 로컬 실행 방법

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드 및 프로덕션 실행

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

## 계산식 개요

### 기본 계산

- **GMV (Gross Merchandise Value)**: 판매가
- **플랫폼 수수료**: `판매가 × 플랫폼 수수료율`
- **결제 수수료**: `판매가 × 결제 수수료율`
- **추가 수수료**: `판매가 × 추가 수수료율`
- **총 수수료**: 위 3개 수수료의 합

### 반품 비용

- **기대 반품 비용**: `(반품율 / 100) × 반품 배송비`

### 총 비용

- **총 비용**: `원가 + 출고 배송비 + 포장비 + 주문당 광고비 + 기타 변동비 + 기대 반품 비용`

### 실수령 및 마진율

- **실수령**: `판매가 - 총 수수료 - 총 비용`
- **실마진율**: `판매가 > 0 ? (실수령 / 판매가) × 100 : 0`

### 손익분기 판매가 (BEP)

- **BEP**: `총 비용 / (1 - 총 수수료율)`
- **조건**: 총 수수료율이 100% 미만일 때만 계산 가능
- **총 수수료율**: `플랫폼 수수료율 + 결제 수수료율 + 추가 수수료율` (소수 합)

### 신호등 상태

- **RED**: 실수령 < 0 (손실)
- **YELLOW**: 실수령 ≥ 0 && 실마진율 < 10% (저마진)
- **GREEN**: 실마진율 ≥ 10% (양호)

## 수수료 프리셋

### 스마트스토어
- 플랫폼 수수료율: 2.0%
- 결제 수수료율: 1.8%
- 추가 수수료율: 0%

### 쿠팡
- 플랫폼 수수료율: 10.0%
- 결제 수수료율: 0%
- 추가 수수료율: 0%

**면책 조항**: 위 수수료 프리셋은 참고용 기본값입니다. 실제 수수료는 플랫폼 정책, 상품 카테고리, 계약 조건 등에 따라 달라질 수 있으므로, 사용자는 본인의 실제 수수료로 수정하여 사용해야 합니다.

## 링크 공유 사용법

계산 상태를 URL 쿼리 파라미터로 저장하여 공유할 수 있습니다. URL을 복사하여 다른 사람에게 전달하거나, 북마크로 저장하여 나중에 동일한 조건으로 복원할 수 있습니다.

### 쿼리 파라미터 예시

```
/?platform=smartstore&salePrice=10000&cost=5000&shipOut=3000&packaging=500&adCostPerOrder=1000&otherVariable=0&returnRate=5&returnShipBack=3000&platformFeeRate=0.02&paymentFeeRate=0.018&extraFeeRate=0
```

### 파라미터 설명

- `platform`: `smartstore` 또는 `coupang`
- `salePrice`: 판매가 (원)
- `cost`: 원가 (원)
- `shipOut`: 출고 배송비 (원)
- `packaging`: 포장비 (원)
- `adCostPerOrder`: 주문당 광고비 (원)
- `otherVariable`: 기타 변동비 (원)
- `returnRate`: 반품율 (%)
- `returnShipBack`: 반품 배송비 (원)
- `platformFeeRate`: 플랫폼 수수료율 (소수, 예: 0.02 = 2%)
- `paymentFeeRate`: 결제 수수료율 (소수, 예: 0.018 = 1.8%)
- `extraFeeRate`: 추가 수수료율 (소수, 예: 0 = 0%)

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks (useState, useMemo, useEffect)

## 프로젝트 구조

```
/app
  /page.tsx                    # 메인 페이지
  /layout.tsx                  # 루트 레이아웃
  /globals.css                 # 전역 스타일
/components
  /PlatformTabs.tsx           # 플랫폼 선택 탭
  /InputForm.tsx              # 입력 폼
  /ResultCards.tsx            # 결과 카드
  /BreakdownTable.tsx         # 상세 breakdown 테이블
/lib
  /fees.ts                    # 수수료 프리셋 및 타입 정의
  /calc.ts                    # 계산 로직
  /share.ts                   # URL 직렬화/역직렬화
```

## 라이선스

MIT License
