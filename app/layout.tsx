import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "셀러 실마진 계산기 | 온라인 셀러 수익성 분석 도구",
  description: "10개 이상의 쇼핑몰 플랫폼을 지원하는 실마진 계산기. 스마트스토어, 쿠팡, 11번가 등 플랫폼별 수수료 비교 및 손익분기 분석. 부가세 계산, 판매 시뮬레이션, ROI 계산 등 다양한 기능 제공.",
  keywords: ["실마진 계산기", "셀러 마진 계산", "온라인 셀러", "스마트스토어 수수료", "쿠팡 수수료", "플랫폼 비교", "손익분기점", "부가세 계산", "판매 시뮬레이션"],
  authors: [{ name: "Seller Margin Lab" }],
  creator: "Seller Margin Lab",
  publisher: "Seller Margin Lab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "셀러 실마진 계산기 | 온라인 셀러 수익성 분석 도구",
    description: "10개 이상의 쇼핑몰 플랫폼을 지원하는 실마진 계산기. 플랫폼별 수수료 비교 및 손익분기 분석.",
    url: "/",
    siteName: "셀러 실마진 계산기",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "셀러 실마진 계산기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "셀러 실마진 계산기",
    description: "온라인 셀러를 위한 실마진 계산 · 플랫폼 수수료 비교 · 손익분기 분석 도구",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "셀러 실마진 계산기",
    description: "온라인 셀러를 위한 실마진 계산 · 플랫폼 수수료 비교 · 손익분기 분석 도구",
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    featureList: [
      "실마진 계산",
      "플랫폼 수수료 비교",
      "손익분기점 분석",
      "부가세 계산",
      "판매 시뮬레이션",
      "ROI 계산",
    ],
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0.0",
  };

  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7373977880685678" />
        <meta name="google-site-verification" content="lSJTeWuV8EZQIBkHAfSRPQlK59uyaYjsnYH_DhIv2r4" />
        <meta name="naver-site-verification" content="249ab66e366ff5b46934242c934777ed2a07507e" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7373977880685678"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <main className="min-h-screen">
          <section className="border-b border-blue-100/80 bg-white/75 backdrop-blur dark:border-gray-800 dark:bg-gray-900/75">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="max-w-3xl space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
                    Seller Margin Lab
                  </p>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 sm:text-base">
                    온라인 셀러를 위한 실마진 계산과 수익성 분석
                  </h2>
                  <p className="text-xs leading-5 text-gray-600 dark:text-gray-400 sm:text-sm">
                    플랫폼 수수료, 부가세, 광고비, 반품비를 반영해 실제 손익을 계산합니다. 계산 기준과
                    수수료 해석은 가이드에서 함께 확인할 수 있습니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/guide"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    계산 가이드 보기
                  </Link>
                </div>
              </div>
            </div>
          </section>
          {children}
        </main>
      </body>
    </html>
  );
}

