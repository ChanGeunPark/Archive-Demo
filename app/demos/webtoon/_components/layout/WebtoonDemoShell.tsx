import Link from "next/link";
import type { ReactNode } from "react";
import Typography from "@/components/typography/Typography";

type WebtoonDemoShellProps = {
  children: ReactNode;
};

export default function WebtoonDemoShell({ children }: WebtoonDemoShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-semibold text-gray-700">
            ← 포트폴리오 아카이브
          </Link>
          <Typography variant="caption" color={500}>
            CHIZU COMICS Webtoon Demo
          </Typography>
        </div>
      </div>
      <main className="mx-auto w-full max-w-5xl pb-16">{children}</main>
    </div>
  );
}
