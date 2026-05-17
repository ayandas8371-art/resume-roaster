import { createAdminClient, isSupabaseConfigured } from "./supabase";
import { Plan, type UsageStats } from "@/types";

// ============================================
// QUOTA CONFIGURATION
// ============================================

const PLAN_QUOTAS: Record<Plan, { limit: number; windowDays: number | null }> = {
  [Plan.FREE]:    { limit: 2,  windowDays: 30   }, // 30-day rolling window from first use
  [Plan.STARTER]: { limit: 20, windowDays: null  }, // RevenueCat manages billing cycle
  [Plan.PRO]:     { limit: 30, windowDays: null  }, // RevenueCat manages billing cycle
};

// ============================================
// HELPER: Check and auto-reset if window expired
// ============================================

/**
 * For FREE users:
 *   - The 30-day window starts on first_quota_used_at
 *   - quota_reset_at = first_quota_used_at + 30 days
 *   - If NOW() >= quota_reset_at, reset quota_used = 0 and roll the window forward
 *
 * For PAID users:
 *   - RevenueCat manages the billing cycle entirely via webhooks
 *   - We do NOT auto-reset — RC webhook fires on renewal and we update accordingly
 */
async function autoResetIfExpired(
  supabase: ReturnType<typeof createAdminClient>,
  user: Record<string, any>
): Promise<Record<string, any>> {
  const plan = (user.plan as Plan) || Plan.FREE;

  // Both Free and Paid users get their 30-day usage quota reset automatically.
  // This ensures Annual users get their 30 reports every month without needing a yearly webhook.

  const now = new Date();
  const resetAt = user.quota_reset_at ? new Date(user.quota_reset_at) : null;

  // Window has expired → reset
  if (resetAt && now >= resetAt) {
    // Roll forward: new window starts NOW, expires 30 days from now
    const newResetAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const updatePayload = {
      quota_used: 0,
      quota_reset_at: newResetAt.toISOString(),
      first_quota_used_at: now.toISOString(), // new window start
    };

    let { error: resetError } = await supabase
      .from("users")
      .update(updatePayload)
      .eq("clerk_user_id", user.clerk_user_id);

    // Fallback if migration-rolling-quota columns are not present in Supabase
    if (resetError) {
      console.warn("[Quota] Retrying autoResetIfExpired without first_quota_used_at:", resetError.message);
      const { error: retryError } = await supabase
        .from("users")
        .update({
          quota_used: 0,
          quota_reset_at: newResetAt.toISOString(),
        })
        .eq("clerk_user_id", user.clerk_user_id);
      
      if (retryError) {
        console.error("[Quota] Critical autoResetIfExpired fallback failed:", retryError.message);
      }
    }

    console.log(
      `[Quota] Free user ${user.clerk_user_id} quota auto-reset. Next reset: ${newResetAt.toISOString()}`
    );

    return {
      ...user,
      quota_used: 0,
      quota_reset_at: newResetAt.toISOString(),
      first_quota_used_at: now.toISOString(),
    };
  }

  return user;
}

// ============================================
// CHECK QUOTA
// ============================================

export async function checkQuota(clerkUserId: string): Promise<UsageStats> {
  if (!isSupabaseConfigured()) {
    return {
      quota_used: 0,
      quota_limit: 2,
      roasts_remaining: 2,
      plan: Plan.FREE,
      is_lifetime_limit: false,
    };
  }

  const supabase = createAdminClient();
  let { data: rawUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (error || !rawUser) {
    // Attempt to create user safely on-the-fly
    try {
      let email = "unknown@example.com";
      try {
        const { currentUser } = require("@clerk/nextjs/server");
        const clerkUser = await currentUser();
        email = clerkUser?.emailAddresses?.[0]?.emailAddress || email;
      } catch (_) {}

      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          clerk_user_id: clerkUserId,
          email,
          plan: Plan.FREE,
          quota_limit: 2,
          quota_used: 0,
        })
        .select()
        .single();
        
      if (!createError && newUser) {
        rawUser = newUser;
      } else {
        // Retry select if conflict or duplicate occurred
        const { data: retryUser } = await supabase
          .from("users")
          .select("*")
          .eq("clerk_user_id", clerkUserId)
          .single();
        if (retryUser) rawUser = retryUser;
      }
    } catch (_) {}
  }

  if (!rawUser) {
    return {
      quota_used: 0,
      quota_limit: 2,
      roasts_remaining: 2,
      plan: Plan.FREE,
      is_lifetime_limit: false,
    };
  }

  // Auto-reset free users whose 30-day window has expired
  const user = await autoResetIfExpired(supabase, rawUser);

  const plan = (user.plan as Plan) || Plan.FREE;
  const planConfig = PLAN_QUOTAS[plan];
  const quota_used = user.quota_used || 0;
  const quota_limit = user.quota_limit || planConfig.limit;
  const roasts_remaining = Math.max(0, quota_limit - quota_used);

  return {
    quota_used,
    quota_limit,
    roasts_remaining,
    plan,
    is_lifetime_limit: false,
    // Extra fields for the UI to display reset date
    quota_reset_at: user.quota_reset_at ?? undefined,
  } as UsageStats & { quota_reset_at?: string };
}

export const getUserUsage = checkQuota;

// ============================================
// DECREMENT QUOTA
// ============================================

export async function decrementQuota(clerkUserId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;

  const supabase = createAdminClient();

  // Fetch current state (including auto-reset check)
  const { data: rawUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (fetchError || !rawUser) return true;

  // Run auto-reset before decrement
  const user = await autoResetIfExpired(supabase, rawUser);

  const plan = (user.plan as Plan) || Plan.FREE;
  const quota_limit = user.quota_limit || PLAN_QUOTAS[plan].limit;
  const quota_used = user.quota_used || 0;

  // Guard: quota already exhausted
  if (quota_used >= quota_limit) return false;

  const now = new Date();
  const isFirstUse = !user.first_quota_used_at || quota_used === 0;

  // For free users: set the 30-day rolling window on FIRST use
  const updatePayload: Record<string, any> = {
    quota_used: quota_used + 1,
  };

  if (plan === Plan.FREE && isFirstUse) {
    // Anchor the 30-day window to this exact moment
    const resetAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    updatePayload.first_quota_used_at = now.toISOString();
    updatePayload.quota_reset_at = resetAt.toISOString();

    console.log(
      `[Quota] Free user ${clerkUserId} first use. Window: ${now.toISOString()} → ${resetAt.toISOString()}`
    );
  }

  // Update user quota defensively
  let { error: updateError } = await supabase
    .from("users")
    .update(updatePayload)
    .eq("clerk_user_id", clerkUserId);

  // Fallback: If update fails (possibly due to missing first_quota_used_at column),
  // retry updating only the standard columns (quota_used and quota_reset_at)
  if (updateError) {
    console.warn("[Quota] Retrying decrement update without first_quota_used_at due to:", updateError.message);
    const fallbackPayload: Record<string, any> = {
      quota_used: updatePayload.quota_used,
    };
    if (updatePayload.quota_reset_at) {
      fallbackPayload.quota_reset_at = updatePayload.quota_reset_at;
    }
    const { error: retryError } = await supabase
      .from("users")
      .update(fallbackPayload)
      .eq("clerk_user_id", clerkUserId);
      
    if (retryError) {
      // Final fallback: just try updating quota_used
      console.warn("[Quota] Final decrement retry updating only quota_used due to:", retryError.message);
      const { error: finalError } = await supabase
        .from("users")
        .update({ quota_used: updatePayload.quota_used })
        .eq("clerk_user_id", clerkUserId);
        
      updateError = finalError;
    } else {
      updateError = null;
    }
  }

  if (updateError) {
    console.error("[Quota] Decrement failed after all fallbacks:", updateError.message);
    return false;
  }

  return true;
}

// ============================================
// UPDATE USER PLAN (called by RevenueCat webhook + sync endpoint)
// ============================================

export async function updateUserPlan(
  clerkUserId: string,
  newPlan: Plan,
  options?: { subscriptionStartedAt?: Date; nextRenewalAt?: Date }
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = createAdminClient();
  const planConfig = PLAN_QUOTAS[newPlan];
  const now = new Date();

  let quota_reset_at: string | null = null;

  if (newPlan === Plan.FREE) {
    // Downgrade: reset quota, clear window — will be set on next use
    quota_reset_at = null;
  } else {
    // Paid plan: RevenueCat controls the billing cycle, but we manage the 30-day usage cycle.
    // We anchor the usage reset to 30 days from this moment.
    quota_reset_at = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  }

  const updatePayload = {
    plan: newPlan,
    quota_limit: planConfig.limit,
    quota_used: 0,
    quota_reset_at,
    subscription_started_at:
      newPlan !== Plan.FREE
        ? (options?.subscriptionStartedAt ?? now).toISOString()
        : null,
    first_quota_used_at: null, // reset anchor on plan change
  };

  const { error: updateError } = await supabase
    .from("users")
    .update(updatePayload)
    .eq("clerk_user_id", clerkUserId);

  if (updateError) {
    console.warn("[Quota] Retrying updateUserPlan without missing schema columns:", updateError.message);
    const { error: retryError } = await supabase
      .from("users")
      .update({
        plan: newPlan,
        quota_limit: planConfig.limit,
        quota_used: 0,
        quota_reset_at,
      })
      .eq("clerk_user_id", clerkUserId);
      
    if (retryError) {
      console.error("[Quota] Critical updateUserPlan fallback failed:", retryError.message);
    }
  }

  console.log(`[Quota] Plan updated for ${clerkUserId}: ${newPlan}, resets at: ${quota_reset_at}`);
}

// ============================================
// LOG USAGE EVENT
// ============================================

export async function logUsage(
  userId: string,
  action: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = createAdminClient();
  await supabase.from("usage_logs").insert({
    user_id: userId,
    action,
    metadata: metadata || null,
  });
}
