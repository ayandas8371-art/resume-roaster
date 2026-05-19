"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Rocket, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/10 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/20 bg-black transition-transform group-hover:scale-110">
            <img 
              src="/brand/logo.png" 
              alt="Hired or Roasted Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Hired<span className="text-purple-500">Or</span>Roasted
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <SignedOut>
            <Link href="/#how-it-works" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">How it Works</Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="/blog" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Blog</Link>
            <div className="h-4 w-px bg-white/10" />
            <SignInButton mode="modal">
              <button className="text-sm font-semibold text-white/80 hover:text-white transition-colors">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition-all hover:pr-8 active:scale-95">
                <span>Try Free</span>
                <Sparkles className="h-4 w-4 text-purple-600 transition-transform group-hover:rotate-12" />
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard" className="group flex items-center gap-2 text-sm font-bold text-white transition-all hover:text-purple-400">
              <Rocket className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              Go to Dashboard
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9 border border-white/20 rounded-xl"
                }
              }}
            />
          </SignedIn>
        </nav>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="rounded-full bg-white/5 p-2 text-white md:hidden hover:bg-white/10 transition-colors"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[72px] z-40 bg-black/95 backdrop-blur-3xl md:hidden"
          >
            <nav className="flex flex-col gap-6 p-8">
              <SignedOut>
                <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} className="text-2xl font-bold text-white">How it Works</Link>
                <Link href="/#pricing" onClick={() => setMobileOpen(false)} className="text-2xl font-bold text-white">Pricing</Link>
                <Link href="/blog" onClick={() => setMobileOpen(false)} className="text-2xl font-bold text-white">Blog</Link>
                <div className="h-px bg-white/10" />
                <SignInButton mode="modal">
                  <button className="text-left text-xl font-medium text-gray-400">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-2xl bg-white py-4 text-center text-xl font-bold text-black">Get Started</button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-2xl font-bold text-white">
                  <Rocket className="h-6 w-6 text-purple-500" />
                  Dashboard
                </Link>
                <div className="h-px bg-white/10" />
                <div className="flex items-center gap-4">
                  <UserButton showName />
                </div>
              </SignedIn>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
