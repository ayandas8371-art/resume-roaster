"use client";

import { useRevenueCat } from "@/components/providers/revenuecat-provider";
import { useClerk, useUser } from "@clerk/nextjs";
import { PricingCard } from "@/components/pricing-card";
import { Plan } from "@/types";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function Pricing() {
  const { showPaywall, isInitialized, isLoading } = useRevenueCat();
  const { isSignedIn } = useUser();
  const clerk = useClerk();
  const router = useRouter();

  const handleSelect = (plan: Plan) => {
    if (!isSignedIn) {
      clerk.openSignUp();
      return;
    }

    if (plan === Plan.FREE) {
      router.push("/dashboard");
    } else {
      showPaywall();
    }
  };

  return (
    <section id="pricing" className="relative py-24 lg:py-32 overflow-hidden bg-black">
      {/* Subtle Background Image - Rarely Visible */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/images/bg-pricing.png" 
          alt="" 
          className="h-full w-full object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center relative z-10">
          <h2 className="text-sm font-bold tracking-widest text-purple-500 uppercase">Pricing Plans</h2>
          <p className="mt-4 text-4xl font-black text-white sm:text-6xl">
            Invest in your <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">Future.</span>
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            One coffee worth of investment can land you a $100k+ job. Stop submitting resumes that get ignored.
          </p>
        </div>

        <div className="relative z-10 mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {([Plan.FREE, Plan.STARTER, Plan.PRO] as Plan[]).map((plan, i) => (
            <motion.div
              key={plan}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <PricingCard
                plan={plan}
                onSelect={handleSelect}
                disabled={!isInitialized || isLoading}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
