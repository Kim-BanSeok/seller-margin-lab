import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calculator, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "실마진 계산 가이드 | 온라인 셀러 수익성 분석 방법",
  description: "온라인 셀러를 위한 실마진 개념, 플랫폼별 수수료 비교, 마진율 계산 공식, 부가세 처리, 손익분기점 분석 방법을 상세히 안내합니다.",
  openGraph: {
    title: "실마진 계산 가이드 | 온라인 셀러 수익성 분석 방법",
    description: "실마진 개념부터 플랫폼 수수료 비교까지, 온라인 셀러가 알아야 할 수익성 분석의 모든 것.",
  },
};

export default function GuidePage() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        계산기로 돌아가기
      </Link>

      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          실마진 계산 가이드
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          온라인 셀러가 알아야 할 수익성 분석의 핵심 개념과 계산 방법을 정리했습니다.
        </p>
      </header>

      <article className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            실마진이란?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>실마진(實마진)</strong>은 온라인 쇼핑몰에서 상품을 판매할 때 발생하는 모든 비용을 차감한 후의 실제 수익률을 말합니다. 단순히 매입가와 판매가의 차이만 보는 &quot;표면 마진&quot;과 달리, 플랫폼 수수료, 배송비, 부가세, 광고비, 반품 비용 등을 모두 반영한 수치입니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
            온라인 셀러는 실마진을 정확히 파악해야 건강한 사업 운영이 가능합니다. 수수료와 비용을 간과하면 겉보기에는 수익이 나는 것처럼 보이지만 실제로는 적자일 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            마진율 계산 공식
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            실마진율은 다음 공식으로 계산합니다:
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              실마진율 = (순이익 / 판매가) × 100
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              순이익 = 판매가 - 매입가 - 플랫폼 수수료 - 부가세 - 배송비 - 포장비 - 광고비 - 기타 변동비 - 반품 비용
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            부가세는 일반 과세자의 경우 (판매가 - 매입가)의 부가가치에 대해 10%가 적용됩니다. 간이 과세자는 부가세가 0%로 계산됩니다. 매입가와 판매가를 부가세 포함 금액으로 입력해야 정확한 계산이 됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            플랫폼별 수수료 비교
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            온라인 쇼핑 플랫폼마다 수수료 구조가 다릅니다. 주요 플랫폼의 수수료 특성을 요약하면:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>스마트스토어:</strong> 기본 판매 수수료 약 3.63%, 연동 수수료(네이버 쇼핑 노출 시) 약 3%, 배송비 수수료 약 3.63%. 카테고리별로 차이가 있습니다.
            </li>
            <li>
              <strong>쿠팡:</strong> 기본 판매 수수료 약 11.88%, 배송비 수수료 약 3.3%. 연동 수수료 없음.
            </li>
            <li>
              <strong>11번가·지마켓·옥션:</strong> 기본 수수료 약 13%, 연동 수수료 약 2%, 배송비 수수료 약 3.3%.
            </li>
            <li>
              <strong>카페24:</strong> 셀프호스팅이라 플랫폼 수수료는 낮으나(약 3%), 결제 수수료 등이 별도 발생합니다.
            </li>
            <li>
              <strong>도매꾹:</strong> 기본 수수료 약 5%로 도매/B2B 중심 플랫폼 중 상대적으로 낮은 편입니다.
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            같은 상품이라도 플랫폼에 따라 실마진이 크게 달라질 수 있으므로, 진입 전 플랫폼 비교를 꼭 해보시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            손익분기점(BEP)이란?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>손익분기점(Break-Even Point)</strong>은 순이익이 0원이 되는 판매가를 의미합니다. 이 금액 이하로 판매하면 적자가 발생합니다. 고정비(배송비, 포장비 등 주문당 일정 비용)가 있을 때, 수수료율과 비용 구조를 고려해 최소 판매가를 산출하는 데 활용할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            실마진 계산기 활용 tip
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            셀러 실마진 계산기는 다음과 같이 활용할 수 있습니다:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>판매 전 예상 마진율 확인</li>
            <li>플랫폼 간 수수료 비교로 진입 플랫폼 선택</li>
            <li>할인·프로모션 시 최소 판매가 산출</li>
            <li>부가세 포함/제외 가격 입력으로 정확한 세금 반영</li>
            <li>반품율·광고비 입력으로 현실적인 수익성 예측</li>
          </ul>
        </section>
      </article>

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Calculator className="w-4 h-4" />
          계산기 바로가기
        </Link>
      </div>
    </div>
  );
}
