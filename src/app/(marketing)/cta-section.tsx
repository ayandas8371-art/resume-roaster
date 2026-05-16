"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-bg-primary py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-bg-secondary to-bg-tertiary p-8 text-center sm:p-12"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-red/5 to-accent-purple/5" />
          <div className="relative">
            <Flame className="mx-auto h-10 w-10 text-accent-red" />
            <h2 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl">
              Ready to Get Roasted?
            </h2>
            <p className="mt-3 text-text-secondary">
              Your resume isn&apos;t going to fix itself. Well, technically ours will. But you have to upload it first.
            </p>
            <Link
              href="/sign-up"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-red to-accent-purple px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-purple/20 transition-all hover:opacity-90 hover:scale-[1.03]"
            >
              Try Free — No Credit Card
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
