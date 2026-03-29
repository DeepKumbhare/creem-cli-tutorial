"use client";

import { CreemPortal } from "@creem_io/nextjs";
import { useSearchParams } from "next/navigation";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customer_id");

  return (
    <div className="flex min-h-screen items-center justify-center flex-col bg-zinc-50 font-sans dark:bg-black">
      <div className="max-w-2xl w-full px-6">
        <h1 className="text-3xl font-bold text-center mt-20">
          Payment Successful!
        </h1>
        <p className="text-center mt-4 text-gray-600">
          Thank you for your purchase. Your transaction has been completed
          successfully.
        </p>

        {/* Customer Portal Link */}
        {customerId && (
          <div className="mt-8 flex justify-center">
            <CreemPortal customerId={customerId}>
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                Manage Billing & Subscriptions
              </button>
            </CreemPortal>
          </div>
        )}

        {/* Fallback message if no customerId */}
        {!customerId && (
          <div className="mt-8 text-center text-gray-500">
            <p>
              You can manage your billing and subscriptions from your account
              dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
