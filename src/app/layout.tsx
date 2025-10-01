import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import PageTransition from "@/components/page-transition";
import { AppSettingsProvider } from "@/contexts/app-settings-context";
import { SessionProvider } from "@/contexts/session-context";
import { NotificationProvider } from "@/components/notification-container";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "USMS Dashboard",
  description: "Track suspects' assets, finances, tasks, and documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-gray-900 text-white`}>
        <Providers>
          <NotificationProvider>
            <AppSettingsProvider>
              {/* <SessionProvider> */}
                <PageTransition>
                  {children}
                </PageTransition>
              {/* </SessionProvider> */}
            </AppSettingsProvider>
          </NotificationProvider>
        </Providers>
      </body>
    </html>
  );
}
