import type { Metadata } from "next";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";
import ApolloProvider from "./demos/image-marketplace-flow/_components/layout/ApolloProvider";

export const metadata: Metadata = {
  title: "Archive Demo",
  description: "Portfolio demo archive for company work samples.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ApolloProvider>
          <QueryProvider>{children}</QueryProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
