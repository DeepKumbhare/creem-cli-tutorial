import { CreemCheckout } from "@creem_io/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Creem + Next.js
            </h1>
            <nav className="flex gap-3">
              <a
                href="/orders"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Orders
              </a>
              <a
                href="/subscriptions"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Subscriptions
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">
          <div className="mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Products
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Choose the perfect product for your needs
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product 1: One-time Purchase */}
            <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-800">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                One-time
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                UI Kit Bundle
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Complete design system with components, templates, and
                documentation
              </p>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    $199
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    lifetime access
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                    <span className="text-blue-700 dark:text-blue-300 text-xs">
                      ✓
                    </span>
                  </span>
                  500+ Components
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                    <span className="text-blue-700 dark:text-blue-300 text-xs">
                      ✓
                    </span>
                  </span>
                  Design Tokens
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                    <span className="text-blue-700 dark:text-blue-300 text-xs">
                      ✓
                    </span>
                  </span>
                  Free Updates
                </li>
              </ul>

              <CreemCheckout
                productId="prod_6aQJBaXjZzGhQDArDXe55m"
                checkoutPath="/api/checkout"
              >
                <button className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm hover:shadow-md">
                  Get Now
                </button>
              </CreemCheckout>
            </div>

            {/* Product 2: Subscription */}
            <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-800">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                Subscription
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Image Generator SaaS
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Powerful AI-powered image generation at your fingertips
              </p>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    $12
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    per month
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                    <span className="text-emerald-700 dark:text-emerald-300 text-xs">
                      ✓
                    </span>
                  </span>
                  500 images/month
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                    <span className="text-emerald-700 dark:text-emerald-300 text-xs">
                      ✓
                    </span>
                  </span>
                  Priority Processing
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                    <span className="text-emerald-700 dark:text-emerald-300 text-xs">
                      ✓
                    </span>
                  </span>
                  Cancel Anytime
                </li>
              </ul>

              <CreemCheckout
                productId="prod_5PrU9h573ROasTsHXQkGTN"
                checkoutPath="/api/checkout"
              >
                <button className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm hover:shadow-md">
                  Subscribe Now
                </button>
              </CreemCheckout>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 px-6">
          <div className="max-w-5xl mx-auto text-center text-slate-600 dark:text-slate-400 text-sm">
            <p>© 2024 Creem + Next.js Demo. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
