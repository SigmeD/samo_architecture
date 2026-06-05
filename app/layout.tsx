import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Roboto, Fira_Sans } from "next/font/google";
import "@/styles/brand.css";

const roboto = Roboto({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], variable: "--font-roboto" });
const fira = Fira_Sans({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], variable: "--font-fira" });

export const metadata: Metadata = {
  title: "DNM Architecture Explorer",
  description: "Интерактивный атлас архитектуры модуля «Дети на миллион»",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${roboto.variable} ${fira.variable}`}>
      <body>{children}</body>
    </html>
  );
}
