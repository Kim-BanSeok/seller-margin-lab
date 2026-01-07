# 셀러 실마진 계산기

온라인 셀러를 위한 실마진 계산 · 플랫폼 수수료 비교 · 손익분기 분석 도구

## 프로젝트 소개

이 도구는 온라인 셀러가 상품 판매 시 실제 수익성을 정확히 계산할 수 있도록 도와주는 전문 계산기입니다. 10개 이상의 주요 쇼핑몰 플랫폼을 지원하며, 판매가, 비용, 수수료를 입력하면 정산금액, 순이익, 실마진율, 손익분기 판매가를 즉시 계산합니다. 부가세 계산, 플랫폼 비교, 판매 시뮬레이션 등 다양한 고급 기능을 제공합니다.

## 주요 기능

### 핵심 기능
- **10개 플랫폼 지원**: 스마트스토어, 쿠팡, 11번가, 지마켓, 옥션, 인터파크, 오늘의집, 카페24, 도매꾹, 기타 마켓
- **실시간 계산**: 입력값 변경 시 즉시 결과 갱신 (React.useMemo 최적화)
- **수수료 프리셋**: 플랫폼별 기본 수수료 자동 적용 (사용자 수정 가능)
- **부가세 계산**: 일반 과세자/간이 과세자 지원, 부가세율 자동 계산
- **상세 내역**: 매출, 수수료, 부가세, 비용 항목별 breakdown 제공
- **신호등 상태**: 수익성 상태를 RED/YELLOW/GREEN으로 시각화
- **플랫폼 비교**: 두 플랫폼을 동시에 비교하여 수익성 분석
- **링크 공유**: 현재 계산 상태를 URL로 공유하여 동일한 조건으로 복원 가능
- **라이트 모드**: 간소화된 계산기 인터페이스
- **반응형 디자인**: 모바일 우선, 데스크톱 2열 레이아웃

### 확장 기능
- **계산 히스토리**: 계산 결과 저장 및 불러오기 (최대 50개)
- **목표 마진 계산기**: 목표 마진율 달성을 위한 최소 판매가 계산
- **판매량 시뮬레이션**: 판매량별 수익 시뮬레이션
- **월별/연간 예측**: 월별 판매량 기반 수익 예측
- **ROI 계산기**: 투자 대비 수익률 및 회수 기간 계산
- **시나리오 비교**: A/B/C 시나리오 동시 비교
- **알림 시스템**: 마진율, 수수료율 기반 경고 알림
- **커스텀 프리셋**: 사용자 정의 수수료 프리셋 저장 및 관리
- **리포트 생성**: CSV 다운로드 및 이미지 저장
- **차트 시각화**: 수익 구조 파이 차트 및 막대 그래프
- **공식 가이드**: 계산 공식 상세 안내

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

- **GMV (Gross Merchandise Value)**: 판매가 + 받은 배송비
- **기본 판매 수수료**: `판매가 × 기본 판매 수수료율`
- **연동 수수료**: `판매가 × 연동 수수료율` (네이버 쇼핑 등)
- **배송비 수수료**: `받은 배송비 × 배송비 수수료율`
- **총 수수료**: 위 3개 수수료의 합

### 부가세 계산

- **일반 과세자**: `부가세 = (판매가 - 매입가) × 부가세율`
- **간이 과세자**: 부가세 면제 (0%)
- **기본 부가세율**: 10% (일반 과세자)

### 반품 비용

- **기대 반품 비용**: `(반품율 / 100) × 반품 배송비`

### 총 비용

- **총 비용**: `원가 + 출고 배송비 + 포장비 + 주문당 광고비 + 기타 변동비 + 기대 반품 비용`

### 정산금액 및 순이익

- **정산금액**: `판매가 + 받은 배송비 - 총 수수료`
- **순이익**: `정산금액 - 총 비용 - 부가세`
- **실마진율**: `판매가 > 0 ? (순이익 / 판매가) × 100 : 0`

### 손익분기 판매가 (BEP)

- **BEP**: `총 비용 / (1 - 총 수수료율)`
- **조건**: 총 수수료율이 100% 미만일 때만 계산 가능
- **총 수수료율**: `기본 판매 수수료율 + 연동 수수료율` (소수 합)

### 신호등 상태

- **RED**: 순이익 < 0 (손실)
- **YELLOW**: 순이익 ≥ 0 && 실마진율 < 10% (저마진)
- **GREEN**: 실마진율 ≥ 10% (양호)

## 지원 플랫폼 및 수수료 프리셋

### 스마트스토어
- 기본 판매 수수료율: 3.63%
- 연동 수수료율: 3.0%
- 배송비 수수료율: 3.63%

### 쿠팡
- 기본 판매 수수료율: 11.88%
- 연동 수수료율: 0%
- 배송비 수수료율: 3.3%

### 11번가
- 기본 판매 수수료율: 13%
- 연동 수수료율: 2%
- 배송비 수수료율: 3.3%

### 지마켓
- 기본 판매 수수료율: 13%
- 연동 수수료율: 2%
- 배송비 수수료율: 3.3%

### 옥션
- 기본 판매 수수료율: 13%
- 연동 수수료율: 2%
- 배송비 수수료율: 3.3%

### 인터파크
- 기본 판매 수수료율: 13%
- 연동 수수료율: 2%
- 배송비 수수료율: 3.3%

### 오늘의집
- 기본 판매 수수료율: 8%
- 연동 수수료율: 0%
- 배송비 수수료율: 0%

### 카페24
- 기본 판매 수수료율: 3%
- 연동 수수료율: 0%
- 배송비 수수료율: 0%

### 도매꾹
- 기본 판매 수수료율: 5%
- 연동 수수료율: 0%
- 배송비 수수료율: 0%

### 기타 마켓
- 기본 판매 수수료율: 11% (평균)
- 연동 수수료율: 2%
- 배송비 수수료율: 3.3%

**면책 조항**: 위 수수료 프리셋은 참고용 기본값입니다. 실제 수수료는 플랫폼 정책, 상품 카테고리, 계약 조건 등에 따라 달라질 수 있으므로, 사용자는 본인의 실제 수수료로 수정하여 사용해야 합니다.

## 링크 공유 사용법

계산 상태를 URL 쿼리 파라미터로 저장하여 공유할 수 있습니다. URL을 복사하여 다른 사람에게 전달하거나, 북마크로 저장하여 나중에 동일한 조건으로 복원할 수 있습니다.

### 쿼리 파라미터 예시

```
/?platform=smartstore&salePrice=10000&receivedShipping=3000&cost=5000&shipOut=3000&packaging=500&adCostPerOrder=1000&otherVariable=0&returnRate=5&returnShipBack=3000&baseFeeRate=0.0363&linkageFeeRate=0.03&shippingFeeRate=0.0363&taxType=general&vatRate=0.1
```

### 파라미터 설명

- `platform`: 플랫폼 선택 (`smartstore`, `coupang`, `11st`, `gmarket`, `auction`, `interpark`, `ohouse`, `cafe24`, `domeggook`, `other`)
- `salePrice`: 판매가 (원)
- `receivedShipping`: 받은 배송비 (원)
- `cost`: 원가 (원)
- `shipOut`: 출고 배송비 (원)
- `packaging`: 포장비 (원)
- `adCostPerOrder`: 주문당 광고비 (원)
- `otherVariable`: 기타 변동비 (원)
- `returnRate`: 반품율 (%)
- `returnShipBack`: 반품 배송비 (원)
- `baseFeeRate`: 기본 판매 수수료율 (소수, 예: 0.0363 = 3.63%)
- `linkageFeeRate`: 연동 수수료율 (소수, 예: 0.03 = 3%)
- `shippingFeeRate`: 배송비 수수료율 (소수, 예: 0.0363 = 3.63%)
- `taxType`: 과세 유형 (`general` 또는 `simple`)
- `vatRate`: 부가세율 (소수, 예: 0.1 = 10%)

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks (useState, useMemo, useEffect)
- **Icons**: lucide-react
- **Charts**: recharts
- **Animations**: framer-motion
- **Notifications**: react-hot-toast
- **Export**: html2canvas (이미지), CSV 다운로드

## 프로젝트 구조

```
/app
  /page.tsx                    # 메인 페이지
  /layout.tsx                  # 루트 레이아웃
  /globals.css                 # 전역 스타일
  /icon.svg                    # 파비콘
/components
  /PlatformTabs.tsx           # 플랫폼 선택 탭
  /PlatformDropdown.tsx       # 플랫폼 드롭다운
  /PlatformSelector.tsx       # 플랫폼 선택기
  /InputForm.tsx              # 입력 폼
  /ResultCards.tsx            # 결과 카드
  /BreakdownTable.tsx         # 상세 breakdown 테이블
  /ComparisonView.tsx         # 플랫폼 비교 뷰
  /ChartSection.tsx           # 차트 섹션
  /FeatureTabs.tsx            # 기능 탭
  /HistoryPanel.tsx           # 히스토리 패널
  /TargetMarginCalculator.tsx # 목표 마진 계산기
  /SalesSimulation.tsx        # 판매 시뮬레이션
  /MonthlyForecast.tsx        # 월별 예측
  /ROICalculator.tsx          # ROI 계산기
  /ScenarioCompare.tsx        # 시나리오 비교
  /AlertSystem.tsx            # 알림 시스템
  /CustomPresetManager.tsx    # 커스텀 프리셋 관리
  /ReportGenerator.tsx        # 리포트 생성
  /LightModeView.tsx          # 라이트 모드 뷰
  /FormulaGuide.tsx           # 공식 가이드
  /AdBanner.tsx               # 광고 배너
  /Header.tsx                 # 헤더
  /Logo.tsx                   # 로고
  /ActionButtons.tsx          # 액션 버튼
  /Tooltip.tsx                # 툴팁
/lib
  /fees.ts                    # 수수료 프리셋 및 타입 정의
  /calc.ts                    # 계산 로직
  /calc-extended.ts           # 확장 계산 로직
  /share.ts                   # URL 직렬화/역직렬화
  /storage.ts                 # LocalStorage 관리
  /export.ts                  # 데이터 내보내기
  /utils.ts                   # 유틸리티 함수
```

## 주요 개선사항

### 버그 수정
- 이미지 저장 시 모든 내용이 포함되도록 수정
- 1만원 이하 선택버튼 표시 문제 수정
- 수수료 구조 업데이트 (새로운 구조 반영)
- AlertSystem netPayout → netProfit 수정

### 코드 품질
- LocalStorage 에러 처리 강화 (용량 초과, 비활성화 등)
- 입력값 검증 강화 (NaN, Infinity 처리)
- AdSense 로드 실패 에러 처리
- TypeScript 타입 안정성 개선

### 접근성
- ARIA 레이블 추가 (버튼, 입력 필드)
- 키보드 네비게이션 개선
- 포커스 관리 개선
- 스크린 리더 지원 (aria-live, aria-label)

## 라이선스

MIT License
