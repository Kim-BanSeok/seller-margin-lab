import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "셀러 실마진 계산기",
  description: "온라인 셀러를 위한 실마진 계산 · 플랫폼 수수료 비교 · 손익분기 분석 도구",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

