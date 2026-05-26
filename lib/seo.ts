import type { Metadata } from "next";

export const SITE_NAME = "Archive Demo";
export const SITE_SHORT_NAME = "Archive Demo";
export const SITE_DESCRIPTION =
  "회사 업무 경험을 바탕으로 재구성한 포트폴리오 데모 아카이브. AI 캐릭터 채팅, 이미지 마켓플레이스 등 실제 서비스 흐름을 직접 체험할 수 있습니다.";
export const SITE_LOCALE = "ko_KR";

const DEFAULT_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!url) {
    return DEFAULT_SITE_URL;
  }

  return url.replace(/\/$/, "");
}

export function absoluteUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function buildCanonical(path = "/"): Metadata["alternates"] {
  return {
    canonical: absoluteUrl(path),
  };
}

type BuildPageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
};

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  keywords,
  noIndex = false,
  openGraph,
  twitter,
}: BuildPageMetadataOptions): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const url = absoluteUrl(canonicalPath);

  return {
    title,
    description,
    keywords,
    alternates: buildCanonical(canonicalPath),
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      type: "website",
      locale: SITE_LOCALE,
      siteName: SITE_NAME,
      title,
      description,
      url,
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...twitter,
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_SHORT_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "포트폴리오",
    "Next.js",
    "데모",
    "AI 채팅",
    "마켓플레이스",
    "React",
    "Supabase",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: buildCanonical("/"),
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    inLanguage: "ko-KR",
  };
}

export function buildWebPageJsonLd({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
}: {
  title: string;
  description?: string;
  path?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    inLanguage: "ko-KR",
  };
}

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
