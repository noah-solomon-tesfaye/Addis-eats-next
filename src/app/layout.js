import "./globals.css";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

import { auth } from "../../auth";
import { Providers } from "./providers";
import { ThemeProvider } from "./ThemeProvider";
import ThemeToggle from "./ThemeToggle";
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

export default async function RootLayout({ children }) {
  const session = await auth();

  const role = session?.user?.role ?? null;
  const authenticated = Boolean(session?.user?.id);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased`}
      >
        <ThemeProvider>
          <Providers>
            <div className="min-h-screen">
              <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
                  <Link
                    href="/"
                    className="shrink-0 rounded-lg text-xl font-bold tracking-tight text-[var(--secondary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)] sm:text-2xl"
                  >
                    Addis Eats
                  </Link>

                  <div className="flex items-center gap-2">
                    <ThemeToggle />

                    <MobileNavigation
                      role={role}
                      authenticated={authenticated}
                    />
                  </div>
                </div>
              </header>

              {children}

              <footer className="mt-12 border-t border-[var(--border)] bg-[var(--surface)]">
                <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-[var(--muted)] sm:px-6 lg:px-8">
                  © {new Date().getFullYear()} Addis Eats
                </div>
              </footer>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}