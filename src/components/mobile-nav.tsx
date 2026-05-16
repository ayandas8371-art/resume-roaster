"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview",  icon: LayoutDashboard, href: "/dashboard" },
  { label: "Billing",   icon: CreditCard,      href: "/dashboard/billing" },
  { label: "Settings",  icon: Settings,        href: "/dashboard/settings" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Top bar (mobile/tablet only) ── */}
      <header className="lg:hidden sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-black/60 px-4 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 overflow-hidden items-center justify-center rounded-xl bg-black border border-white/10 shadow-[0_0_16px_rgba(249,115,22,0.25)]">
            <img src="/brand/logo.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          <span className="text-sm font-black tracking-tight text-white">RoastMyResume</span>
        </Link>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-300 transition-all hover:bg-white/10 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* ── Drawer overlay ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/5 bg-black/95 backdrop-blur-xl lg:hidden"
            >
              {/* Header */}
              <div className="flex h-16 items-center justify-between border-b border-white/5 px-5">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 overflow-hidden items-center justify-center rounded-xl bg-black border border-white/10 shadow-[0_0_16px_rgba(249,115,22,0.25)]">
                    <img src="/brand/logo.png" alt="Logo" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-tight text-white">RoastMyResume</p>
                    <p className="text-[9px] font-semibold text-orange-400 uppercase tracking-widest">Command Center</p>
                  </div>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex-1 space-y-1 px-3 py-6">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200",
                        isActive
                          ? "bg-white/5 text-white"
                          : "text-gray-500 hover:bg-white/5 hover:text-gray-200"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-orange-400 to-purple-500" />
                      )}
                      <item.icon className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-orange-400" : "text-gray-600 group-hover:text-gray-300"
                      )} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="border-t border-white/5 p-4">
                <SignOutButton>
                  <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 transition-all hover:bg-red-500/10 hover:text-red-400">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
