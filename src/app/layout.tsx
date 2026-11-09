import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Shield, Sparkles, Scale, ExternalLink } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "PropGuard Risk Hub — Institutional Prop Firm Risk & Lot Size Engine",
    template: "%s | PropGuard Risk Hub",
  },
  description:
    "Zero-latency client-side position sizing and drawdown survival engine. Exact lot sizes for FTMO, FundedNext, The5ers, Alpha Capital, and Topstep with spread and commission buffers.",
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
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        {/* MyBid Ad Network Script */}
        <script async src="https://js.mbidadm.com/static/scripts.js" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300`}
        suppressHydrationWarning
      >
        {/* Modern Bloomberg-Style Top Navigation */}
        <nav className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:scale-105 transition-all shadow-lg shadow-emerald-500/10">
                <Shield className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white leading-none">
                  Prop<span className="text-emerald-400">Guard</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Risk Hub
                </span>
              </div>
            </Link>

            {/* Center Status Beacon */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>100% Client-Side Engine</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">Zero Latency</span>
            </div>

            {/* Nav Links & CTA */}
            <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
              <Link
                href="/compare"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Firms</span>
              </Link>
              <Link
                href="/#calculators"
                className="hover:text-white transition-colors hidden sm:inline-block"
              >
                Calculators
              </Link>
              <Link
                href="/about"
                className="hover:text-white transition-colors hidden sm:inline-block text-slate-400"
              >
                About
              </Link>
              <a
                href="https://github.com/gechgb/propguard-risk-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                title="View on GitHub"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1">{children}</div>

        {/* Modern Institutional Footer */}
        <footer className="border-t border-slate-800/60 bg-gradient-to-b from-slate-950 to-slate-900 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div className="col-span-2 md:col-span-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm text-white">
                    Prop<span className="text-emerald-400">Guard</span> Risk Hub
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Institutional position sizing and daily drawdown risk management built for prop firm traders. Zero backend, zero tracking, 100% private.
                </p>
                <div className="text-[11px] font-mono text-emerald-400/80 pt-1">
                  v2.0 • Deterministic Client Math
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Top Calculators
                </h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li>
                    <Link href="/calculators/ftmo/xauusd" className="hover:text-emerald-400 transition-colors">
                      FTMO Gold (XAUUSD)
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculators/fundednext/xauusd" className="hover:text-emerald-400 transition-colors">
                      FundedNext Gold
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculators/the5ers/nas100" className="hover:text-emerald-400 transition-colors">
                      The5ers NAS100
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculators/topstep/us30" className="hover:text-emerald-400 transition-colors">
                      Topstep US30 Futures
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculators/alpha-capital/eurusd" className="hover:text-emerald-400 transition-colors">
                      Alpha Capital EUR/USD
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Analysis &amp; Specs
                </h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li>
                    <Link href="/compare" className="hover:text-emerald-400 transition-colors">
                      Firm Rules Comparison
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculators/ftmo/btcusd" className="hover:text-emerald-400 transition-colors">
                      Bitcoin CFD Sizing
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculators/ftmo/gbpjpy" className="hover:text-emerald-400 transition-colors">
                      GBPJPY JPY Pip Math
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-emerald-400 transition-colors">
                      Calculation Methodology
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Compliance &amp; Legal
                </h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li>
                    <Link href="/disclaimer" className="hover:text-emerald-400 transition-colors">
                      Financial Non-Advice Disclaimer
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">
                      Privacy Policy &amp; Cookies
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://github.com/gechgb/propguard-risk-hub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Source Code</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
              <p>&copy; 2026 PropGuard Risk Hub. All rights reserved.</p>
              <p className="text-[11px] text-slate-500 text-center sm:text-right">
                Trading futures, forex, and CFDs involves substantial risk of loss. Always verify calculations with your broker.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
