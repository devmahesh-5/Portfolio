import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/app/Providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mahesh's Portfolio",
  description: "Welcome to my personal portfolio website showcasing my projects, skills, and experiences as a developer.",
  icons: {
    icon: "/logo.png",
  },
  keywords: [
    "Mahesh Bhandari",
    "Portfolio",
    "Web Developer",
    "Full Stack Developer",
  ],

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
        {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
