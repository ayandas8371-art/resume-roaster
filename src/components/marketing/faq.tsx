"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "Is the roast actually helpful?", a: "Yes. Behind every savage burn is an actionable improvement. The humor makes you pay attention. The fixes make you employable." },
  { q: "What AI model do you use?", a: "We use multiple advanced AI models, including DeepSeek and other state-of-the-art systems. The result? Faster, funnier, and more accurate roasts." },
  { q: "Is my resume data safe?", a: "Absolutely. We don't store your resume text long-term. PDFs are processed server-side and text is only kept for generating your roast. We never sell or share your data." },
  { q: "Can I share my roast?", a: "Yes! Every roast generates a shareable card with your score and funniest burn. Share it on Twitter, LinkedIn, or wherever you want to publicly humiliate yourself." },
  { q: "How does the free plan work?", a: "You get 2 lifetime roasts for free. No credit card required. After that, upgrade to Starter ($9/mo) or Pro ($14/mo) for more roasts and premium features." },
  { q: "What if my resume is a scanned PDF?", a: "We need text-based PDFs. If your resume is a scanned image, you'll get an error. Try re-saving it from your word processor as a text-based PDF." },
  { q: "Do you really roast every resume?", a: "Yes. No resume is safe. Whether you're a fresh grad or a VP, the AI finds something to roast. Usually several somethings." },
  { q: "Can I cancel anytime?", a: "Of course. Cancel your subscription anytime through your billing page. No questions asked, no guilt trips (okay, maybe a little guilt trip)." },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-32 overflow-hidden bg-black">
      {/* Subtle Background Image - Rarely Visible */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/images/bg-community.png" 
          alt="" 
          className="h-full w-full object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-3 text-text-secondary">Everything you need to know before getting destroyed.</p>
        </motion.div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-bg-primary"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-text-primary">{faq.q}</span>
                <ChevronDown className={cn("h-4 w-4 text-text-secondary transition-transform", openIndex === i && "rotate-180")} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-text-secondary">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
