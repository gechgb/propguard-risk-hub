# PropGuard Risk Hub 🛡️

> **Production-grade, 100% client-side position sizing and prop-firm drawdown survival engine.** Built for funded traders on **FTMO**, **FundedNext**, **The5ers**, **Alpha Capital Group**, and **Topstep**.

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Zero-Cost Static Export](https://img.shields.io/badge/Hosting-100%25%20Static-emerald)](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

## ⚡ Core Features

- **Institutional Math Engine (`lib/riskMath.ts`):** Deterministic calculations that floor lot sizes to the nearest 0.01 micro lot so you never breach your risk budget.
- **True Dollar Risk:** Stop-loss dollar risk + live spread pips + round-turn commissions in USD.
- **Daily Drawdown Survival Meter:** Visual progress gauge displaying exactly how much of your firm's daily limit is consumed by a single trade, along with **consecutive full stops before breach**.
- **Prop-Firm Danger Alerts:**
  - 🟡 **Caution Alert:** Triggered if a trade consumes $> 30\%$ of the daily drawdown limit.
  - 🔴 **Danger Alert:** Triggered if a trade consumes $> 50\%$ of the daily drawdown limit.
- **Dual Risk Input Modes:**
  - `% of Balance` (0.1% to 3.0% with interactive slider and quick 0.25%, 0.5%, 1.0%, 2.0% pills)
  - `Fixed Dollar ($)` amount ($50 to $10,000)
- **Stop-Loss Units:** Toggle between **Pips**, **Points**, or **Price Change ($)**.
- **Risk-to-Reward (RR) Projector:** 1:1, 1:1.5, 1:2, and 1:3 take-profit gain calculator with Phase 1 & 2 target progression.
- **One-Click Trade Setup Copy:** Copy position sizing, stop-loss, and dollar risk directly to your clipboard for your Discord, Telegram, or Notion trading journal.
- **Zero Layout Shift (CLS = 0):** Bloomberg / TradingView dark interface (`bg-slate-950`, `border-slate-800`).
- **Offline / Local State Persistence:** Remembers your selected Prop Firm, Instrument, Account Size, Risk %, and SL distance via `localStorage`.

---

## 📊 Programmatic SEO (pSEO) Matrix

PropGuard includes a pre-computed SEO matrix in [`src/data/prop-seo-matrix.json`](src/data/prop-seo-matrix.json) that generates **40 static calculator pages** via `generateStaticParams()` at build time:

### Supported Prop Firms
| Firm | Program | Daily DD | Max DD | DD Model | Daily Reset Rule |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **FTMO** | FTMO 2-Step Challenge | 5.0% | 10.0% | Static (Equity & Balance) | Midnight CE(S)T Server Time |
| **FundedNext** | Stellar 2-Step | 5.0% | 10.0% | Static (Balance-Based) | Server Daily Rollover |
| **The5ers** | High Stakes 2-Step | 5.0% | 10.0% | Higher-of-Equity-or-Balance | 00:00 Server Time |
| **Alpha Capital Group** | Alpha Pro Evaluation | 4.0% | 8.0% | Static Max (Zero Comm) | 00:00 Server Time |
| **Topstep** | Trading Combine | 2.0% | 4.0% | Trailing Max Drawdown | 16:00 CT Rollover |

### Supported Instruments & Contract Specs
| Symbol | Asset Class | Contract Size | 1 Pip | Pip Value (1.00 Lot) | Typical Spread |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **XAUUSD** | Metals | 100 Troy Oz | 0.10 | $10.00 / lot | 1.8 pips |
| **EURUSD** | Forex Major | 100,000 EUR | 0.0001 | $10.00 / lot | 0.4 pips |
| **GBPUSD** | Forex Major | 100,000 GBP | 0.0001 | $10.00 / lot | 0.8 pips |
| **USDJPY** | Forex Major | 100,000 USD | 0.01 | $6.67 / lot | 0.6 pips |
| **GBPJPY** | Forex Cross | 100,000 GBP | 0.01 | $6.67 / lot | 1.1 pips |
| **NAS100** | Indices | 1 Contract | 1.00 | $1.00 / lot | 1.2 pips |
| **US30** | Indices | 1 Contract | 1.00 | $1.00 / lot | 2.0 pips |
| **BTCUSD** | Crypto | 1 BTC | 1.00 | $1.00 / lot | 25.0 pips |

---

## 🧮 Position Sizing Mathematical Formula

$$\text{Target Risk (\$) } = \text{Account Balance} \times \left(\frac{\text{Risk \%}}{100}\right)$$

$$\text{Cost Per Lot (\$) } = \left(\text{SL Pips} + \text{Spread Pips}\right) \times \text{Pip Value} + \text{Commission Per Lot}$$

$$\text{Recommended Lots } = \frac{\lfloor \frac{\text{Target Risk (\$) }}{\text{Cost Per Lot (\$) }} \times 100 \rfloor}{100}$$

> **Why we floor:** Standard financial roundings can round *up* (e.g. 1.256 lots to 1.26 lots), which pushes the true dollar loss past your prop firm's daily drawdown cap. PropGuard floors every calculation to guarantee non-exceedance.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/gechgb/propguard-risk-hub.git
cd propguard-risk-hub
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Build & Export Static Site
```bash
npm run build
```
Compiled static HTML and assets are generated inside the `out/` directory.

---

## 🌐 Zero-Cost Hosting Deployment

### Deploy to Vercel (Recommended)
1. Import repository at [vercel.com/new](https://vercel.com/new).
2. Framework Preset: **Next.js**.
3. Click **Deploy**. Vercel will build and deploy the static app worldwide on edge CDN.

### Deploy to GitHub Pages
1. Go to repository **Settings** $\rightarrow$ **Pages**.
2. Under **Build and deployment**, set Source to **GitHub Actions**.
3. Push to `main` — the included `.github/workflows/deploy.yml` workflow will automatically build and publish the live site.

---

## 💰 Monetization & AdSense Compliance

- **CLS-Safe Ad Wrapper (`components/AdSlot.tsx`):**
  - Pre-allocated heights (`min-h-[90px]` leaderboard, `min-h-[250px]` rectangle) to ensure Cumulative Layout Shift (CLS) is zero.
  - Automatically switches between development skeleton boxes and production Google `<ins>` tags.
  - To activate your ads, replace `ca-pub-XXXXXXXXXXXXXXXX` in `components/AdSlot.tsx` with your AdSense Publisher ID.
- **Mandatory Trust & Policy Pages:**
  - `/privacy-policy`: Full Google DoubleClick DART cookies, analytics, and localStorage disclosures.
  - `/terms`: Terms of Service.
  - `/about`: Project mission, trading methodology, and background.
  - `/disclaimer`: Financial non-advice and regulatory risk disclosure.
- **SEO & Search Indexing:**
  - Automated `sitemap.xml` generated at `/sitemap.xml`.
  - `robots.txt` generated at `/robots.txt`.
  - Structured JSON-LD schema (`FAQPage` and `SoftwareApplication`) on all 40 dynamic pages.

---

## 📜 License

MIT License &copy; 2026 PropGuard Risk Hub. Free for personal and commercial use.
