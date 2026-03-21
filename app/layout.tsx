import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CookieBanner from "@/components/CookieBanner";
import { ThemeProvider } from "@/context/ThemeContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ofertonazos - Las mejores ofertas",
  description: "Descubre las mejores ofertas y chollos del momento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
        <ThemeProvider>
          <CookieConsentProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <CookieBanner />
          </CookieConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
