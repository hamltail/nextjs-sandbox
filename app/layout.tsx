import type { Metadata } from "next";
import { Barlow_Condensed, Noto_Sans_JP } from "next/font/google";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ThemeProvider from "@/components/theme/ThemeProvider";

import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "hamltail Web Lab",
  description: "作って、試して、探索するWebのラボ。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJp.variable} ${barlowCondensed.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-white text-slate-950 transition-colors dark:bg-slate-950 dark:text-gray-100">
        <ThemeProvider>
          <Header />

          <main className="flex-1">{children}</main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
