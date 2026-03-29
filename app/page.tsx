import { CreemCheckout } from "@creem_io/nextjs";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center  py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="pb-20">
          <div className="flex items-center justify-between w-full mb-8">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              Creem + Nextjs Demo
            </h1>
            <div className="flex gap-2">
              <a
                href="/orders"
                className="px-3 py-2 text-sm rounded-md bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
              >
                Orders
              </a>
              <a
                href="/subscriptions"
                className="px-3 py-2 text-sm rounded-md bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
              >
                Subscriptions
              </a>
            </div>
          </div>
          <h2 className="mt-6 text-2xl text-gray-700 dark:text-gray-300">
            UI Kit bundle - $199 lifetime access
          </h2>

          <CreemCheckout
            productId="prod_6aQJBaXjZzGhQDArDXe55m"
            checkoutPath="/api/checkout"
          >
            <button className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Buy Now
            </button>
          </CreemCheckout>
        </div>

        <div>
          <h2 className="mt-6 text-2xl text-gray-700 dark:text-gray-300">
            Image Generator SaaS - 29$/month
          </h2>
          <CreemCheckout
            productId="prod_5PrU9h573ROasTsHXQkGTN"
            checkoutPath="/api/checkout"
          >
            <button className="mt-6 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
              Subscribe
            </button>
          </CreemCheckout>
        </div>
      </main>
    </div>
  );
}
