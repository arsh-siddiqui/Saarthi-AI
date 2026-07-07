import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Saarthi AI — Your AI Civic Companion",
  description:
    "Access government services, report issues, understand documents, and get personalized assistance through one intelligent AI companion.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} font-sans antialiased bg-background text-ink`}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}

