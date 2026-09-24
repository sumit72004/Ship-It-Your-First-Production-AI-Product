import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AccessiCraft AI | Production-Ready Web Accessibility Remediation Engine",
  description: "Identify WCAG 2.1 AA/AAA accessibility barriers, generate production-ready fixes, and preview screen reader announcements in real-time with Claude 3.5 Sonnet.",
  keywords: ["accessibility", "a11y", "wcag", "screen reader", "claude", "nextjs", "frontend capstone"],
  authors: [{ name: "Sumit" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
