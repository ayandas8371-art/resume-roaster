"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PROD_URL = "https://hiredorroasted.online";

export function ReferFriendCard() {
  const [copied, setCopied] = useState(false);

  // ✅ Deferred to useEffect — prevents SSR/client hydration mismatch error
  const [referralLink, setReferralLink] = useState(PROD_URL + "/?ref=share");
  useEffect(() => {
    setReferralLink(`${window.location.origin}/?ref=share`);
  }, []);

  const shareText = `🔥 I just roasted my resume and got brutally honest AI feedback. Try it free → ${referralLink}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
    } catch {
      const el = document.createElement("textarea");
      el.value = referralLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Hired or Roasted",
          text: "Get brutally honest AI feedback on your resume. It's free!",
          url: referralLink,
        });
      } catch {
        // User cancelled — fine
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Stop Submitting Mid Resumes</h3>
      <p className="text-sm text-gray-400">
        Know someone whose resume needs saving? Send them the link — it&apos;s free and brutal.
      </p>

      {/* Link Box */}
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
        <span className="flex-1 truncate text-xs text-gray-400 font-mono select-all">
          {referralLink}
        </span>
        <button
          onClick={handleCopyLink}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-white/10 active:scale-95"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1 text-emerald-400"
              >
                <Check className="h-3 w-3" /> Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Copy className="h-3 w-3" /> Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Primary Share Button */}
      <button
        onClick={handleNativeShare}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black transition-all hover:scale-[1.02] hover:bg-gray-100 active:scale-[0.98]"
      >
        <Gift className="h-4 w-4" />
        Refer a Friend
      </button>

      {/* Social Buttons */}
      <div className="flex gap-3">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
          </svg>
          LinkedIn
        </a>
      </div>
    </div>
  );
}
