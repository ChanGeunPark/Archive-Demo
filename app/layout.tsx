import type { Metadata, Viewport } from "next";
import JsonLd from "@/components/seo/JsonLd";
import QueryProvider from "@/providers/QueryProvider";
import { buildWebsiteJsonLd, rootMetadata } from "@/lib/seo";
import "./globals.css";
import ApolloProvider from "./demos/image-marketplace-flow/_components/layout/ApolloProvider";

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: "#f4f0ea",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <JsonLd data={buildWebsiteJsonLd()} />
        <ApolloProvider>
          <QueryProvider>{children}</QueryProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
