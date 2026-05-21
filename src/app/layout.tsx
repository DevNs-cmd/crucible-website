import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://crucible.algoforce.ai"),
  title: "Crucible | Where Founders Are Forged",
  description: "Crucible is the futuristic startup ecosystem from AlgoForce AI, powering the next generation of builders, startups, and AI-native founders.",
  keywords: [
    "Crucible",
    "AlgoForce AI",
    "Startup Ecosystem",
    "AI Founders",
    "Builder Community",
    "Hackathons",
    "AI Future Labs",
    "Startup Accelerator"
  ],
  authors: [{ name: "AlgoForce AI" }],
  openGraph: {
    title: "Crucible | Where Founders Are Forged",
    description: "Crucible is the futuristic startup ecosystem from AlgoForce AI, powering the next generation of builders, startups, and AI-native founders.",
    url: "https://crucible.algoforce.ai",
    siteName: "Crucible Ecosystem",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Crucible Ecosystem | Where Founders Are Forged",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crucible | Where Founders Are Forged",
    description: "Crucible is the futuristic startup ecosystem from AlgoForce AI, powering the next generation of builders, startups, and AI-native founders.",
    creator: "@AlgoForceAI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#FAF8F5" />
      </head>
      <body className="min-h-full flex flex-col bg-crucible-bg text-crucible-navy antialiased">
        {children}
      </body>
    </html>
  );
}
