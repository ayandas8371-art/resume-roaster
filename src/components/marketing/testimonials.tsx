"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Alex K.", role: "Software Engineer", text: "I was offended for exactly 3 minutes. Then I realized my resume actually was garbage. The fixed version got me 3 interviews in a week.", rating: 5 },
  { name: "Priya S.", role: "Product Manager", text: "The AI said my resume had 'the personality of a corporate email signature.' Fair. The rewritten version actually sounds like a human wrote it.", rating: 5 },
  { name: "Marcus T.", role: "Marketing Lead", text: "I shared my roast score on Twitter and it went semi-viral. 42/100. The humiliation was worth the 6 job offers that followed.", rating: 5 },
  { name: "Jen L.", role: "UX Designer", text: "The roast pointed out I used 'detail-oriented' five times. FIVE. The improved bullets actually show my work instead of just describing it.", rating: 5 },
];

export function Testimonials() {
  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Subtle Background Image - Rarely Visible */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/images/bg-community.png" 
          alt="" 
          className="h-full w-full object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">People Love Getting Roasted</h2>
          <p className="mt-3 text-text-secondary">Don&apos;t take our word for it. Take theirs.</p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-bg-secondary p-6"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-accent-orange text-accent-orange" />
                ))}
              </div>
              <p className="mt-3 text-sm text-text-secondary">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4">
                <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                <p className="text-xs text-text-secondary">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
