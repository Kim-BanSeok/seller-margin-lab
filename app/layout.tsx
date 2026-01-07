import type { Metadata } from "next";
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
        {children}
      </body>
    </html>
  );
}

