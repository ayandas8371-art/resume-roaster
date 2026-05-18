// ============================================
// CORE TYPES FOR HIRED OR ROASTED
// ============================================

export enum Plan {
  FREE = "free",
  STARTER = "starter",
  PRO = "pro",
}

export interface Burn {
  quote: string;
  burn: string;
  fix: string;
}

export interface RoastResult {
  score: number;
  headline: string;
  burns: Burn[];
  biggest_crime: string;
  verdict: string;
  fixed_summary: string;
  fixed_bullets: string[];
}

export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  plan: Plan;
  quota_limit: number;
  quota_used: number;
  quota_reset_at: string | null;
  created_at: string;
}

export interface Roast {
  id: string;
  user_id: string;
  resume_name: string;
  resume_text: string | null;
  roast_json: RoastResult;
  score: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  revenuecat_customer_id: string | null;
  plan: Plan;
  status: "active" | "cancelled" | "expired" | "past_due";
  renews_at: string | null;
  created_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  action: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface UsageStats {
  quota_used: number;
  quota_limit: number;
  roasts_remaining: number;
  plan: Plan;
  is_lifetime_limit: boolean;
}

export interface UploadResult {
  text: string;
  fileName: string;
  storageUrl: string | null;
}

export interface ApiError {
  error: string;
  code: string;
  details?: string;
}

export interface PlanConfig {
  name: string;
  displayName: string;
  price: number;
  priceLabel: string;
  priceSuffix?: string;
  quotaLimit: number;
  isLifetime: boolean;
  features: string[];
  popular?: boolean;
  billedAnnually?: string;
  discountBadge?: string;
}

export const PLAN_CONFIGS: Record<Plan, PlanConfig> = {
  [Plan.FREE]: {
    name: "free",
    displayName: "Free",
    price: 0,
    priceLabel: "Free",
    quotaLimit: 2,
    isLifetime: false,
    features: [
      "2 roasts / month",
      "Resume score & feedback",
      "AI-powered improvements",
      "Shareable roast card",
    ],
  },
  [Plan.STARTER]: {
    name: "starter",
    displayName: "Monthly Pro",
    price: 6.99,
    priceLabel: "$6.99/mo",
    quotaLimit: 30,
    isLifetime: false,
    features: [
      "30 roasts/month",
      "Resume score & feedback",
      "AI-powered improvements",
      "Shareable roast cards",
      "Roast history",
      "Priority processing",
    ],
  },
  [Plan.PRO]: {
    name: "pro",
    displayName: "Yearly Pro",
    price: 55.99,
    priceLabel: "$55.99/yr",
    priceSuffix: "/yr",
    quotaLimit: 30,
    isLifetime: false,
    popular: true,
    billedAnnually: "$4.66 per month",
    discountBadge: "Save 33%",
    features: [
      "30 roasts/month",
      "Resume score & feedback",
      "AI-powered improvements",
      "Shareable roast cards",
      "Roast history",
      "Priority processing",
    ],
  },
};
