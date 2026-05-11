import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppHeader } from "@/components/shell/app-header";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Career OS",
  description: "The operating system for becoming AI-native."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
