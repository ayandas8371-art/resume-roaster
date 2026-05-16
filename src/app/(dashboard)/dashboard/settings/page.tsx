"use client";

import { UserProfile } from "@clerk/nextjs";
import { Settings, User, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 pb-12">

      {/* ── Page Header ── */}
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1">
          <Settings className="h-3 w-3 text-orange-400" />
          <span className="text-[11px] font-black uppercase tracking-widest text-orange-400">Account</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">Settings</span>
        </h1>
        <p className="mt-2 text-sm text-gray-400">Manage your profile, email, and security preferences.</p>
      </div>

      {/* ── Info Cards Row ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-purple-600/20 border border-orange-500/20">
            <User className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Profile</p>
            <p className="text-sm font-bold text-white">Name, avatar & email</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/20">
            <Bell className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Security</p>
            <p className="text-sm font-bold text-white">Password & 2FA</p>
          </div>
        </div>
      </div>

      {/* ── Clerk User Profile ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-purple-600/10 blur-[80px]" />
        <div className="relative">
          <UserProfile
            routing="hash"
            appearance={{
              variables: {
                colorBackground:       "transparent",
                colorText:             "#ffffff",
                colorTextSecondary:    "#9ca3af",
                colorPrimary:          "#f97316",
                colorDanger:           "#ef4444",
                colorInputBackground:  "rgba(255,255,255,0.05)",
                colorInputText:        "#ffffff",
                borderRadius:          "12px",
              },
              elements: {
                rootBox:            "w-full",
                card:               "bg-transparent border-none shadow-none",
                navbar:             "bg-white/5 border-r border-white/5",
                navbarButton:       "text-gray-400 hover:text-white",
                navbarButtonIcon:   "text-gray-500",
                pageScrollBox:      "bg-transparent",
                formButtonPrimary:  "bg-gradient-to-r from-orange-500 to-purple-600 text-white font-bold shadow-[0_0_20px_rgba(249,115,22,0.3)]",
                formFieldInput:     "bg-white/5 border-white/10 text-white",
                formFieldLabel:     "text-gray-400",
                headerTitle:        "text-white font-black",
                headerSubtitle:     "text-gray-400",
                profileSectionTitle: "text-white font-bold",
                profileSectionContent: "text-gray-400",
                dividerLine:        "bg-white/5",
                dividerText:        "text-gray-600",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
