"use client";

import { motion } from "framer-motion";
import { Upload, Flame, FileCheck } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload Your Resume", description: "Drag and drop your PDF. We'll extract the text instantly.", color: "text-accent-purple" },
  { icon: Flame, title: "Get Brutally Roasted", description: "AI reviews every line, roasts every cliché, and scores your resume out of 100.", color: "text-accent-red" },
  { icon: FileCheck, title: "Get the Fixed Version", description: "Every roast comes with actionable improvements. Your resume, but actually good.", color: "text-accent-green" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden bg-black">
      {/* Subtle Background Image - Rarely Visible */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/images/bg-how-it-works.png" 
          alt="" 
          className="h-full w-full object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">How It Works</h2>
          <p className="mt-3 text-text-secondary">Three steps to a resume that doesn&apos;t suck.</p>
        </motion.div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-bg-primary p-6 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-bg-tertiary">
                <step.icon className={`h-7 w-7 ${step.color}`} />
              </div>
              <p className="mt-2 text-xs font-medium text-text-secondary">Step {i + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
