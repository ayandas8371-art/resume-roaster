"use client";

import { motion } from "framer-motion";
import { Plan } from "@/types";
import { PricingCard } from "@/components/pricing-card";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export function PricingSection() {
  const router = useRouter();
  const { userId } = useAuth();

  const handleSelect = (plan: Plan) => {
    if (plan === Plan.FREE) {
      if (userId) {
        router.push("/dashboard");
      } else {
        router.push("/sign-up");
      }
    } else {
      // PRO or STARTER plan
      if (userId) {
        // Send logged-in users directly to your new RevenueCat checkout page
        window.location.href = `https://pay.rev.cat/xfrmazoqasqrwiti?app_user_id=${userId}`;
      } else {
        // If they aren't logged in, they must sign up first
        router.push("/sign-up");
      }
    }
  };

  return (
    <section id="pricing" className="bg-bg-primary py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">Simple, Honest Pricing</h2>
          <p className="mt-3 text-text-secondary">Unlike your resume, our pricing has no hidden fluff.</p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {([Plan.FREE, Plan.STARTER, Plan.PRO] as Plan[]).map((plan, i) => (
            <motion.div
              key={plan}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <PricingCard plan={plan} onSelect={handleSelect} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
