"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  LogOut,
  Flame,
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview",  icon: LayoutDashboard, href: "/dashboard" },
  { label: "Billing",   icon: CreditCard,      href: "/dashboard/billing" },
  { label: "Settings",  icon: Settings,        href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col lg:flex h-screen sticky top-0
                      border-r border-white/5
                      bg-black/30 backdrop-blur-xl">

      {/* ── Logo ── */}
      <div className="flex h-20 items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 overflow-hidden items-center justify-center rounded-xl bg-black border border-white/10 shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-shadow group-hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]">
            <img 
              src="/brand/logo.png" 
              alt="Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-black tracking-tight text-white">RoastMyResume</p>
            <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-widest">Command Center</p>
          </div>
        </Link>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-white/5 text-white"
                  : "text-gray-500 hover:bg-white/5 hover:text-gray-200"
              )}
            >
              {/* Active left-border accent */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-orange-400 to-purple-500" />
              )}

              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive
                  ? "text-orange-400"
                  : "text-gray-600 group-hover:text-gray-300"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Pro Tip card ── */}
      <div className="p-4 border-t border-white/5 space-y-4">
        <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-purple-600/10 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">🔥 Pro Tip</p>
          <p className="mt-2 text-xs text-gray-400 leading-relaxed">
            Mention specific measurable outcomes to lower your roast score.
          </p>
        </div>

        <SignOutButton>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold
                             text-gray-500 transition-all hover:bg-red-500/10 hover:text-red-400">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
