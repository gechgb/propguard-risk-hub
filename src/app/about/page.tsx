import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PropGuard Risk Hub",
  description:
    "Learn about PropGuard Risk Hub — a free, open-source prop firm risk management calculator built for traders who need accurate lot sizing.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1>About PropGuard Risk Hub</h1>

        <p>
          PropGuard Risk Hub is a free, browser-based risk management calculator
          designed specifically for traders participating in proprietary (prop)
          trading firm challenges and funded accounts. Our mission is to give
          every trader access to precise, reliable risk calculations — without
          the complexity, cost, or privacy concerns of traditional tools.
        </p>

        <h2>What Is PropGuard Risk Hub?</h2>
        <p>
          At its core, PropGuard Risk Hub is a comprehensive lot-size and risk
          management calculator that accounts for the real-world variables most
          basic calculators ignore. Whether you are calculating position sizes
          for forex pairs, gold (XAU/USD), indices, or other instruments,
          PropGuard Risk Hub factors in spread costs, commission fees, swap
          rates, and prop firm-specific drawdown rules to give you the most
          accurate lot size for every trade.
        </p>
        <p>
          Unlike many trading tools that require sign-ups, subscriptions, or
          send your data to external servers, PropGuard Risk Hub runs entirely
          in your browser. There is no backend, no database, and no data
          collection. Your trading parameters never leave your device.
        </p>

        <h2>How It Works</h2>
        <p>
          PropGuard Risk Hub performs all calculations on the client side using
          JavaScript executed directly in your web browser. Here is the
          step-by-step process:
        </p>
        <ol>
          <li>
            <strong>Select your prop firm</strong> — Choose from a curated list
            of popular prop firms with pre-loaded rules (drawdown type, maximum
            drawdown percentage, profit targets, and scaling plans).
          </li>
          <li>
            <strong>Choose your instrument</strong> — Select from forex pairs,
            commodities (like XAU/USD), indices, and other CFD instruments, each
            with accurate contract specifications.
          </li>
          <li>
            <strong>Enter your trade parameters</strong> — Input your account
            balance, risk percentage, stop-loss distance, entry price, and any
            custom spread or commission values.
          </li>
          <li>
            <strong>Get your results</strong> — The calculator instantly
            computes your optimal lot size, dollar risk, potential profit/loss,
            risk-to-reward ratio, and remaining drawdown buffer — all adjusted
            for spreads and commissions.
          </li>
        </ol>
        <p>
          No data is sent to any server at any point during this process. All
          calculations happen in real time within your browser, and your
          preferences are saved locally using your browser&rsquo;s{" "}
          <code>localStorage</code> for convenience.
        </p>

        <h2>Why We Built PropGuard Risk Hub</h2>
        <p>
          Prop firm trading has exploded in popularity, yet the tools available
          to traders have not kept pace. Most lot-size calculators available
          online suffer from critical shortcomings:
        </p>
        <ul>
          <li>
            <strong>They ignore spread costs.</strong> Many calculators compute
            lot sizes based on stop-loss distance alone, without accounting for
            the fact that spread immediately eats into your risk budget the
            moment you enter a trade.
          </li>
          <li>
            <strong>They ignore commissions.</strong> Round-trip commissions on
            ECN accounts can significantly alter your effective risk, especially
            on smaller account sizes or tighter stops.
          </li>
          <li>
            <strong>They don&rsquo;t understand prop firm rules.</strong>{" "}
            Trailing drawdown, static drawdown, daily loss limits, and
            news-trading restrictions all affect how much risk you can safely
            take. Generic calculators have no concept of these constraints.
          </li>
          <li>
            <strong>They require accounts and collect data.</strong> Many tools
            want your email address, trading account details, or personal
            information just to size a lot. That is unnecessary and invasive.
          </li>
        </ul>
        <p>
          PropGuard Risk Hub was built to solve every one of these problems. We
          believe that accurate risk management should be free, private, and
          accessible to every trader — from beginners taking their first
          challenge to seasoned funded traders managing multiple accounts.
        </p>

        <h2>Supported Prop Firms</h2>
        <p>
          PropGuard Risk Hub includes pre-configured profiles for many of the
          most popular proprietary trading firms, including (but not limited to):
        </p>
        <ul>
          <li>FTMO</li>
          <li>MyFundedFX</li>
          <li>Funded Next</li>
          <li>The Funded Trader</li>
          <li>True Forex Funds</li>
          <li>TopStep</li>
          <li>Apex Trader Funding</li>
          <li>And many more…</li>
        </ul>
        <p>
          Each profile includes that firm&rsquo;s specific drawdown rules,
          profit targets, and account configurations. You can also use fully
          custom settings if your firm is not listed or if you want to simulate
          different scenarios.
        </p>

        <h2>Supported Instruments</h2>
        <p>
          Our calculator supports a wide range of tradable instruments across
          multiple asset classes:
        </p>
        <ul>
          <li>
            <strong>Forex pairs</strong> — Major, minor, and exotic currency
            pairs with accurate pip values and contract sizes
          </li>
          <li>
            <strong>Commodities</strong> — Gold (XAU/USD), silver (XAG/USD),
            crude oil (WTI, Brent), and natural gas
          </li>
          <li>
            <strong>Indices</strong> — US30, NAS100, SPX500, DAX, FTSE, and
            other major global indices
          </li>
          <li>
            <strong>Cryptocurrencies</strong> — BTC/USD, ETH/USD, and other
            popular crypto CFDs (where supported by your prop firm)
          </li>
        </ul>

        <h2>Free &amp; Open to All</h2>
        <p>
          PropGuard Risk Hub is completely free to use. There are no premium
          tiers, no feature gates, and no sign-up required. We believe that
          every trader deserves access to professional-grade risk management
          tools regardless of their account size or experience level.
        </p>
        <p>
          The site is supported by non-intrusive advertising to cover hosting
          and development costs, but the full calculator and all its features
          are available to every visitor at no cost.
        </p>

        <h2>Our Commitment</h2>
        <p>
          We are committed to building the best free risk management tool for
          prop firm traders. We continuously update our instrument data, add
          support for new prop firms, and refine our calculation algorithms
          based on community feedback. If you have suggestions, find a bug, or
          want to see a new feature, we would love to hear from you.
        </p>

        <h2>Contact Us</h2>
        <p>
          Have questions, feedback, or want to request a new prop firm profile?
          Reach out to us at:
        </p>
        <ul>
          <li>
            <strong>Email:</strong> contact@propguardriskhub.com
          </li>
          <li>
            <strong>Website:</strong> propguardriskhub.com
          </li>
        </ul>
      </div>
    </main>
  );
}
