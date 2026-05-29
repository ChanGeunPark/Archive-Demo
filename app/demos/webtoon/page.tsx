import type { Metadata } from "next";
import WebtoonSeriesClient from "./_components/WebtoonSeriesClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "CHIZU COMICS Webtoon Demo",
  description:
    "투표형 웹툰 시리즈 페이지, 회차 목록, 웹툰일지, 정보, 공지 탭까지 확인할 수 있는 CHIZU COMICS 웹툰 데모입니다.",
  path: "/demos/webtoon",
  keywords: ["웹툰", "투표형 웹툰", "CHIZU COMICS", "시리즈 페이지", "Next.js"],
});

export default function WebtoonDemoPage() {
  return <WebtoonSeriesClient />;
}
