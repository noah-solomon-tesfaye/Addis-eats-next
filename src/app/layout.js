import "./globals.css";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import MobileNavigation from "./MobileNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://addiseats.et"),
  title: {
    template: "%s · Addis Eats",
    default: "Addis Eats — food delivery in Addis Ababa",
  },
  description:
    "Discover Ethiopian dishes and order food from Addis Eats, with delivery across Addis Ababa.",
  openGraph: {
    title: "Addis Eats — food delivery in Addis Ababa",
    description:
      "Discover Ethiopian dishes and order food from Addis Eats, with delivery across Addis Ababa.",
    url: "/",
    siteName: "Addis Eats",
    locale: "en_ET",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#faf8f3] text-[#242923] antialiased`}
      >
        <Providers>
          <header className="sticky top-0 z-40 border-b border-[#e9e2d7] bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
              <Link
                href="/"
                className="shrink-0 rounded-lg text-xl font-bold tracking-tight text-[#29443a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a86f2b] sm:text-2xl"
              >
                Addis Eats
              </Link>

              <MobileNavigation />
            </div>
          </header>

          {children}

          <footer className="mt-12 border-t border-[#e9e2d7] bg-white">
            <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-[#73766f] sm:px-6 lg:px-8">
              © {new Date().getFullYear()} Addis Eats
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}