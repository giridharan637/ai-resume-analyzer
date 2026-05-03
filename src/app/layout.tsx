import "globals.css";

import { type Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { lazy } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const ElementSelector = lazy(() =>
  process.env.NODE_ENV === "development"
    ? import("@/components/ElementSelector")
    : Promise.resolve({ default: () => null }),
);

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

const appName = process.env.NEXT_PUBLIC_APP_NAME || "AI Resume Analyzer";

export const metadata: Metadata = {
  title: appName,
  description: `${appName} - Analyze, Improve, and Optimize Your Resume Instantly`,
  icons: "/favicon.ico",

};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
    >
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <main className="flex-1">{children}</main>
          <Toaster richColors />
          <ElementSelector />
        </ThemeProvider>
      </body>
    </html>
  );
}
