import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "OpsPilot - AI DevSecOps Automation",
  description: "Natural language CI/CD pipeline generation, execution, and monitoring powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}
            style={{ background: '#0a0e1a', color: '#f1f5f9' }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
