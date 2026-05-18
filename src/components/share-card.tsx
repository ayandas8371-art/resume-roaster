"use client";

import { motion } from "framer-motion";
import { X, Copy, Check, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { getScoreColor, getScoreGradient } from "@/utils/format";
import {
  generateTwitterShareUrl,
  generateLinkedInShareUrl,
  copyToClipboard,
  generateShareText,
} from "@/utils/share";
import { useState, useRef } from "react";
import { toPng } from "html-to-image";

interface ShareCardProps {
  score: number;
  headline: string;
  bestBurn?: string;
  onClose: () => void;
}

export function ShareCard({ score, headline, bestBurn, onClose }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    const text = generateShareText(score, headline);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      // Wait slightly to ensure fonts are fully ready
      await new Promise(resolve => setTimeout(resolve, 50));

      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "transparent",
      });
      
      const link = document.createElement("a");
      link.download = `resume-roast-${score}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, rotate: -2 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute -top-12 right-0 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <span className="text-xs font-bold uppercase tracking-widest">Close</span>
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6">
          {/* The Actual Card to Capture */}
          <div 
            ref={cardRef}
            className="relative w-full min-h-[640px] h-fit overflow-hidden rounded-[32px] bg-[#0c0514] p-1 shadow-[0_0_50px_rgba(249,115,22,0.15)] ring-1 ring-white/10"
          >
            {/* Custom 3D Background Image */}
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/fun_roast_bg.png" 
                alt="Background" 
                crossOrigin="anonymous"
                className="h-full w-full object-cover opacity-40 mix-blend-luminosity"
              />
              {/* Soft radial vignette to fade the image cleanly into the dark background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#0c0514_100%)] opacity-90" />
            </div>

            {/* Massive Fun Background Orbs using radial gradients (html2canvas compatible) */}
            <div className="absolute -top-40 -right-40 z-0 h-[500px] w-[500px] bg-[radial-gradient(circle,rgba(234,88,12,0.4)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 z-0 h-[500px] w-[500px] bg-[radial-gradient(circle,rgba(147,51,234,0.4)_0%,transparent_70%)] pointer-events-none" />

            {/* Inner Card Content */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-between rounded-[28px] border border-white/10 bg-black/50 p-8 text-center">
              
              {/* Fun Header Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/30 px-5 py-2 shadow-lg">
                <span className="text-lg leading-none">🔥</span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white leading-none mt-0.5">
                  Official Resume Roast
                </span>
              </div>

              {/* Main Score Area - Restored to pure, clean flex layout! */}
              <div className="relative flex flex-col items-center justify-center py-4">
                <p className="mb-1 text-xs font-black uppercase tracking-[0.3em] text-orange-400">Your Score</p>
                <div className="relative flex items-center justify-center overflow-visible py-2">
                  <span className="text-[160px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 drop-shadow-[0_0_40px_rgba(249,115,22,0.3)]">
                    {score}
                  </span>
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Out of 100</p>
              </div>

              {/* Headline */}
              <div className="px-4 relative z-20">
                <h2 className="text-3xl font-black leading-tight tracking-tight text-white drop-shadow-lg">
                  &ldquo;{headline}&rdquo;
                </h2>
              </div>

              {/* Best Burn Box - Restored clean tailwind transforms! */}
              {bestBurn && (
                <div className="relative mt-8 w-full max-w-sm mx-auto transform -rotate-1">
                  {/* Colorful shadow box */}
                  <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-600 opacity-40" />
                  
                  {/* Actual card */}
                  <div className="relative rounded-2xl border-2 border-white/10 bg-[#150a21] p-6 text-left shadow-2xl">
                    {/* Tilted Sticker Badge */}
                    <div className="absolute -top-4 -left-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 shadow-lg border border-orange-300/30 transform -rotate-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">
                        Savage Review
                      </span>
                    </div>
                    <p className="text-center text-sm font-bold leading-relaxed text-gray-200 italic mt-3">
                      &ldquo;{bestBurn}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Fun Footer */}
              <div className="mt-auto flex w-full items-center justify-between pt-8">
                <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 backdrop-blur-sm border border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none mt-0.5">AI Powered</span>
                </div>
                {/* Restored gorgeous gradient text! */}
                <p className="text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 drop-shadow-md">
                  hiredorroasted.online
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-black text-black hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
              DOWNLOAD IMAGE
            </button>
            <button 
              onClick={handleCopy}
              className="flex items-center justify-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-sm font-black text-white hover:bg-white/10 transition-all active:scale-95"
            >
              {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
              {copied ? "COPIED LINK" : "COPY LINK"}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Share On</p>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex justify-center gap-6">
            <a 
              href={generateTwitterShareUrl(score, headline)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-110 transition-all"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a 
              href={generateLinkedInShareUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-110 transition-all"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" /></svg>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", props.className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
