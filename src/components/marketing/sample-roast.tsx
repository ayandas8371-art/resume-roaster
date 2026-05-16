"use client";

import { motion } from "framer-motion";
import { Flame, CheckCircle2 } from "lucide-react";

const sampleBurns = [
  {
    quote: "Results-driven team player with strong communication skills",
    burn: "This phrase has appeared on so many resumes it should qualify for public housing.",
    fix: "Increased conversion rate by 28% through redesigning onboarding flows.",
  },
  {
    quote: "Passionate about innovation and leveraging synergies",
    burn: "Translation: you attended one hackathon in 2019 and peaked.",
    fix: "Architected microservices migration reducing deployment time from 2 hours to 15 minutes.",
  },
  {
    quote: "Managed various cross-functional projects",
    burn: "'Various' is doing more heavy lifting here than you ever did at work.",
    fix: "Led 5 concurrent projects totaling $1.2M in budget with 100% on-time delivery.",
  },
];

export function SampleRoast() {
  return (
    <section id="demo" className="relative py-32 overflow-hidden bg-black">
      {/* Subtle Background Image - Rarely Visible */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/images/bg-sample-roast.png" 
          alt="" 
          className="h-full w-full object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>
      {/* Top Blend Gradient */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">See a Real Roast in Action</h2>
          <p className="mt-3 text-text-secondary">This is what happens when AI has zero chill and full honesty.</p>
        </motion.div>

        {/* Score preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 rounded-2xl border border-border bg-bg-secondary p-6 text-center"
        >
          <p className="text-6xl font-bold bg-gradient-to-r from-accent-red to-accent-orange bg-clip-text text-transparent">42</p>
          <p className="text-sm text-text-secondary mt-1">/100</p>
          <p className="mt-3 italic text-text-primary">&ldquo;Your resume reads like a LinkedIn motivational post written during a caffeine overdose.&rdquo;</p>
        </motion.div>

        {/* Sample burns */}
        <div className="mt-6 space-y-4">
          {sampleBurns.map((burn, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.15 }}
              className="overflow-hidden rounded-xl border border-border bg-bg-secondary"
            >
              <div className="border-b border-border bg-bg-tertiary/50 px-5 py-3">
                <p className="font-mono text-sm text-text-secondary">&ldquo;{burn.quote}&rdquo;</p>
              </div>
              <div className="border-b border-border px-5 py-3 flex items-start gap-2">
                <Flame className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-red" />
                <p className="text-sm text-accent-red">{burn.burn}</p>
              </div>
              <div className="px-5 py-3 flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-green" />
                <p className="text-sm text-accent-green">{burn.fix}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
