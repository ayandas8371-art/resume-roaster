"use client";

import { motion } from "framer-motion";

export function TrustedBy() {
  return (
    <div className="py-20 border-y border-white/5 bg-black/40 backdrop-blur-md overflow-hidden relative">
      {/* Decorative side fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-12">
          Candidates hired by the world&apos;s most innovative startups
        </p>
        
        <div className="relative group">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-full max-w-4xl mx-auto px-4 py-8 rounded-3xl border border-white/5 bg-white/[0.02] shadow-2xl overflow-hidden group-hover:border-white/10 transition-colors">
               <img 
                 src="/images/trusted-logos.png" 
                 alt="Tech Startup Logos" 
                 className="w-full opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
            </div>
            
            <div className="mt-8 flex gap-8">
               <div className="h-1 w-1 rounded-full bg-white/20" />
               <div className="h-1 w-1 rounded-full bg-white/40" />
               <div className="h-1 w-12 rounded-full bg-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
               <div className="h-1 w-1 rounded-full bg-white/40" />
               <div className="h-1 w-1 rounded-full bg-white/20" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
