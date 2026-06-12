"use client";

import { motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles, ShieldCheck, Target, FileText, CheckCircle2, Lock } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { Show } from "@/components/clerk-show";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-black">
      {/* Fun, High-Energy Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/fun-roast-bg-clean.png" 
          alt="Fun Abstract Roast Background" 
          fill
          priority
          quality={80}
          className="object-cover opacity-80 scale-105"
        />
        {/* Protective Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
        {/* Massive Bottom Fade for Seamless Blend */}
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black via-black/90 to-transparent z-10" />
        <div className="absolute inset-x-0 -bottom-64 h-96 bg-black z-20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 inline-flex items-center gap-3 rounded-full border-2 border-orange-500/30 bg-orange-500/10 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-orange-400 backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.2)]"
          >
            <Flame className="h-5 w-5 animate-pulse text-orange-500" />
            <span>Premium Resume Roasting</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-[10rem] leading-[0.85] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            BE ROASTED. <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">GET HIRED.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base sm:text-xl lg:text-2xl text-white/90 leading-relaxed font-bold drop-shadow-md"
          >
            Our AI reads every line of your resume, finds every cliché, scores it brutally out of 100 — then rewrites it so you actually get interviews.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4"
          >
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button className="group relative flex h-14 sm:h-20 items-center justify-center gap-3 overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-600 via-red-600 to-purple-700 px-8 sm:px-12 text-base sm:text-xl font-black text-white transition-all hover:scale-[1.05] active:scale-95 shadow-[0_0_50px_rgba(234,88,12,0.4)]">
                  <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  <Image src="/brand/logo.png" alt="Logo" width={32} height={32} className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
                  Hired or Roasted Free <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
                </button>
              </SignUpButton>
            </Show>
            
            <Show when="signed-in">
              <Link href="/dashboard">
                <button className="group relative flex h-14 sm:h-20 w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-600 via-red-600 to-purple-700 px-8 sm:px-12 text-base sm:text-xl font-black text-white transition-all hover:scale-[1.05] active:scale-95 shadow-[0_0_50px_rgba(234,88,12,0.4)]">
                  <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  <Image src="/brand/logo.png" alt="Logo" width={32} height={32} className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
                  Go to Dashboard <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </Show>

            <Link href="#demo" className="group flex h-14 sm:h-20 items-center justify-center gap-3 rounded-2xl sm:rounded-3xl border-2 border-white/20 bg-white/5 px-8 sm:px-12 text-base sm:text-lg font-black text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/40">
              See a real roast
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 text-sm text-gray-300 font-black tracking-[0.3em] uppercase"
          >
            Join 2,000+ job seekers who got roasted and got hired
          </motion.p>
        </div>
      </div>
    </section>
  );
}
