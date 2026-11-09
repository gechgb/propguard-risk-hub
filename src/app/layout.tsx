import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Shield, Github, ExternalLink } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "PropGuard Risk Hub — Prop Firm Lot Size & Drawdown Calculator",
    template: "%s | PropGuard Risk Hub",
  },
  description:
    "Free prop firm risk calculator. Calculate exact lot sizes for FTMO, FundedNext, The5ers, and Alpha Capital Group with real-time drawdown survival tracking. Zero errors. Zero cost.",
  metadataBase: new URL("https://propguard.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PropGuard Risk Hub",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-100`}
      >
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <Shield className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              <span className="font-bold text-sm tracking-tight">
                Prop<span className="text-emerald-400">Guard</span>
              </span>
            </Link>
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <Link
                href="/about"
                className="hover:text-slate-200 transition-colors"
              >
                About
              </Link>
              <Link
                href="/disclaimer"
                className="hover:text-slate-200 transition-colors"
              >
                Disclaimer
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-slate-200 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-slate-200 transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </nav>

        {children}

        {/* Footer */}
        <footer className="border-t border-slate-800/50 bg-slate-950 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid sm:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-sm">
                    Prop<span className="text-emerald-400">Guard</span> Risk Hub
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Free, zero-error position sizing for prop firm traders.
                  Calculates exact lot sizes with spread, commission, and
                  drawdown buffers to protect your funded account.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Calculators
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-500">
                  <li>
                    <Link
                      href="/calculators/ftmo/xauusd"
                      className="hover:text-slate-300 transition-colors"
                    >
                      FTMO Gold (XAUUSD)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculators/ftmo/eurusd"
                      className="hover:text-slate-300 transition-colors"
                    >
                      FTMO EUR/USD
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculators/fundednext/xauusd"
                      className="hover:text-slate-300 transition-colors"
                    >
                      FundedNext Gold
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculators/the5ers/nas100"
                      className="hover:text-slate-300 transition-colors"
                    >
                      The5ers NAS100
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Legal
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-500">
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="hover:text-slate-300 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="hover:text-slate-300 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/disclaimer"
                      className="hover:text-slate-300 transition-colors"
                    >
                      Financial Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
              <p>&copy; {new Date().getFullYear()} PropGuard Risk Hub. All rights reserved.</p>
              <p>
                Not financial advice. Past performance does not guarantee future
                results.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
