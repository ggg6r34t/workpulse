import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import QueryClientProvider from "@/QueryClientProvider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TimeTrackerProvider } from "./contexts/TimeTrackerContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ClientProviders } from "@/components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "WorkPulse - Time Tracking & Productivity",
    template: "%s | WorkPulse",
  },
  description:
    "Professional time tracking and productivity application. Track your work hours, manage projects, and boost productivity with WorkPulse.",
  keywords: [
    "time tracking",
    "productivity",
    "time management",
    "pomodoro",
    "work tracker",
    "project management",
  ],
  authors: [{ name: "WorkPulse Team" }],
  creator: "WorkPulse",
  publisher: "WorkPulse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "WorkPulse - Time Tracking & Productivity",
    description:
      "Professional time tracking and productivity application. Track your work hours, manage projects, and boost productivity.",
    siteName: "WorkPulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkPulse - Time Tracking & Productivity",
    description:
      "Professional time tracking and productivity application. Track your work hours, manage projects, and boost productivity.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <QueryClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "var(--background)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                    },
                  }}
                />
                <TimeTrackerProvider>
                  <ClientProviders />
                  <Navbar />
                  <main
                    className="w-full min-h-screen p-6 mx-auto pb-20 md:pb-6"
                    role="main"
                  >
                    {children}
                  </main>
                  <Footer />
                  <MobileBottomNav />
                </TimeTrackerProvider>
              </TooltipProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
