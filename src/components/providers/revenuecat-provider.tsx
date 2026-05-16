"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useUser } from "@clerk/nextjs";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlanState {
  isPro: boolean;
  isStarter: boolean;
  plan: "free" | "starter" | "pro";
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface RevenueCatContextType extends PlanState {
  showPaywall: () => Promise<void>;
  refreshPlan: () => Promise<void>;
}

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

export const useRevenueCat = () => {
  const ctx = useContext(RevenueCatContext);
  if (!ctx) throw new Error("useRevenueCat must be used within RevenueCatProvider");
  return ctx;
};

// ─── Entitlement → Plan mapping (must match your RevenueCat dashboard) ────────
const ENTITLEMENT_PLAN_MAP: Record<string, "starter" | "pro"> = {
  "pro": "pro",
  "roast-pro": "pro",
  "resume roster Pro": "pro",
  "resume-roast-pro": "pro",
  "starter": "starter",
  "roast-starter": "starter",
  "resume-roast-starter": "starter",
};

function getPlanFromEntitlements(entitlements: Record<string, { isActive: boolean }>): "free" | "starter" | "pro" {
  // Check pro first (higher tier wins)
  for (const [key, ent] of Object.entries(entitlements)) {
    if (ent.isActive && ENTITLEMENT_PLAN_MAP[key] === "pro") return "pro";
  }
  for (const [key, ent] of Object.entries(entitlements)) {
    if (ent.isActive && ENTITLEMENT_PLAN_MAP[key] === "starter") return "starter";
  }
  return "free";
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const RevenueCatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const purchasesRef = useRef<any>(null); // holds initialized Purchases instance
  const [state, setState] = useState<PlanState>({
    isPro: false,
    isStarter: false,
    plan: "free",
    isLoading: true,
    isInitialized: false,
    error: null,
  });

  // ── Sync plan to our Supabase DB after any purchase/change ───────────────────
  const syncPlanToDb = useCallback(async (plan: "free" | "starter" | "pro") => {
    try {
      await fetch("/api/subscription/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
    } catch (e) {
      console.error("[RC] Failed to sync plan to DB:", e);
    }
  }, []);

  // ── Refresh plan from RevenueCat (source of truth) ───────────────────────────
  const refreshPlan = useCallback(async () => {
    if (!purchasesRef.current) return;
    try {
      const info = await purchasesRef.current.getCustomerInfo();
      const activeEntitlements = info.entitlements.active;
      const plan = getPlanFromEntitlements(activeEntitlements);
      setState(prev => ({
        ...prev,
        plan,
        isPro: plan === "pro",
        isStarter: plan === "starter" || plan === "pro",
        isLoading: false,
      }));
      // Keep our DB in sync
      await syncPlanToDb(plan);
    } catch (e) {
      console.error("[RC] Failed to refresh plan:", e);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [syncPlanToDb]);

  // ── Initialize RevenueCat SDK ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || !user) {
      if (isLoaded) setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY;
    if (!apiKey) {
      console.error("[RC] NEXT_PUBLIC_REVENUECAT_API_KEY is not set");
      setState(prev => ({ ...prev, isLoading: false, error: "Billing not configured" }));
      return;
    }

    const initRC = async () => {
      try {
        // Dynamic import so it only runs client-side (avoids SSR issues)
        const { Purchases } = await import("@revenuecat/purchases-js");

        // Configure with Clerk user ID as the App User ID
        Purchases.configure(apiKey, user.id);
        const instance = Purchases.getSharedInstance();
        purchasesRef.current = instance;

        // Listen for real-time entitlement updates (fires after successful purchase)
        if (typeof instance.addCustomerInfoUpdateListener === "function") {
          instance.addCustomerInfoUpdateListener(async (info: any) => {
            const plan = getPlanFromEntitlements(info.entitlements.active);
            setState(prev => ({
              ...prev,
              plan,
              isPro: plan === "pro",
              isStarter: plan === "starter" || plan === "pro",
            }));
            await syncPlanToDb(plan);
            // Refresh the quota meter globally
            window.dispatchEvent(new CustomEvent("refresh-quota"));
          });
        }

        setState(prev => ({ ...prev, isInitialized: true }));
        await refreshPlan();
      } catch (e: any) {
        console.error("[RC] Initialization failed:", e);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Billing initialization failed. Please refresh.",
        }));
        // Fallback: read plan from our own DB
        try {
          const res = await fetch("/api/usage");
          const data = await res.json();
          const plan = (data.plan as "free" | "starter" | "pro") || "free";
          setState(prev => ({
            ...prev,
            plan,
            isPro: plan === "pro",
            isStarter: plan === "starter" || plan === "pro",
            isLoading: false,
          }));
        } catch (_) {}
      }
    };

    initRC();
  }, [isLoaded, user, refreshPlan, syncPlanToDb]);

  // ── Show RevenueCat Paywall (full-screen checkout overlay) ───────────────────
  const showPaywall = useCallback(async () => {
    if (!purchasesRef.current) {
      console.error("[RC] SDK not initialized. Cannot show paywall.");
      return;
    }

    try {
      const { Purchases } = await import("@revenuecat/purchases-js");
      const instance = Purchases.getSharedInstance();

      // Get the user's email to pre-fill the checkout form
      const emailAddress = user?.emailAddresses?.[0]?.emailAddress;

      // presentPaywall() opens the full RevenueCat checkout overlay
      // It handles plan selection, payment entry (Stripe), and confirmation
      const result = await instance.presentPaywall({
        customerEmail: emailAddress,
        // null = full-screen overlay (default)
        htmlTarget: null as any,
      });

      if (result) {
        // Purchase was completed — result.customerInfo has the updated entitlements
        const plan = getPlanFromEntitlements(result.customerInfo.entitlements.active);
        setState(prev => ({
          ...prev,
          plan,
          isPro: plan === "pro",
          isStarter: plan === "starter" || plan === "pro",
        }));
        await syncPlanToDb(plan);
        // Refresh quota meter in dashboard
        window.dispatchEvent(new CustomEvent("refresh-quota"));
      }
    } catch (e: any) {
      if (e?.userCancelled) {
        console.log("[RC] User cancelled the paywall");
      } else {
        console.error("[RC] Paywall error:", e);
        setState(prev => ({ ...prev, error: "Checkout failed. Please try again." }));
      }
    }
  }, [user, syncPlanToDb]);

  return (
    <RevenueCatContext.Provider value={{ ...state, showPaywall, refreshPlan }}>
      {children}
    </RevenueCatContext.Provider>
  );
};
