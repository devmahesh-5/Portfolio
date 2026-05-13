import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/app/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mahesh Bhandari | Full Stack Developer",
  description: "Portfolio of Mahesh Bhandari, a Full Stack Developer from Nepal specializing in React, Next.js, Node.js, and MongoDB. View projects, skills, and blog posts.",
  keywords: [
    "Mahesh Bhandari",
    "Portfolio",
    "Web Developer",
    "Full Stack Developer",
    "Next.js",
    "React",
    "Node.js",
    "MongoDB",
    "Nepal",
  ],
  authors: [{ name: "Mahesh Bhandari" }],
  openGraph: {
    title: "Mahesh Bhandari | Full Stack Developer",
    description: "Portfolio of Mahesh Bhandari, a Full Stack Developer from Nepal.",
    url: "https://bhandarimahesh.com.np",
    siteName: "Mahesh Bhandari Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahesh Bhandari | Full Stack Developer",
    description: "Portfolio of Mahesh Bhandari, a Full Stack Developer from Nepal.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://bhandarimahesh.com.np",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-on-surface min-h-screen grid-bg selection:bg-primary-fixed-dim/30 selection:text-on-primary-fixed`}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}