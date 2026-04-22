import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KolaMatch Intelligence | AI-Powered Project Scoping",
  description: "Transform raw project ideas into structured job posts and perfectly matched proposals using advanced AI.",
  keywords: ["freelance", "matching", "AI", "project scoping", "Kolaborate", "Africa"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
