import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_SC({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});

const serif = Noto_Serif_SC({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "三十六计",
    template: "%s · 三十六计",
  },
  description:
    "按《三十六计》六套的顺序，每一计先读原文、注释、译文，再用五步把意思讲成能记住的话。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
