import { Plan } from "@/types";
import { updateUserPlan } from "./quota";

// ============================================
// REVENUECAT INTEGRATION
// ============================================

const REVENUECAT_API_BASE = "https://api.revenuecat.com/v1";

// Map RevenueCat entitlements to our plan types
const ENTITLEMENT_TO_PLAN: Record<string, Plan> = {
  starter: Plan.STARTER,
  pro: Plan.PRO,
  "roast-starter": Plan.STARTER,
  "roast-pro": Plan.PRO,
  "resume roster Pro": Plan.PRO,
};

// ============================================
// SERVER-SIDE: Verify subscription status
// ============================================

export async function getSubscriberInfo(
  revenuecatCustomerId: string
): Promise<{
  plan: Plan;
  isActive: boolean;
  expiresAt: string | null;
}> {
  const apiKey = process.env.REVENUECAT_API_KEY;
  if (!apiKey) {
    return { plan: Plan.FREE, isActive: false, expiresAt: null };
  }

  try {
    const response = await fetch(
      `${REVENUECAT_API_BASE}/subscribers/${revenuecatCustomerId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      console.error("RevenueCat API error:", response.status);
      return { plan: Plan.FREE, isActive: false, expiresAt: null };
    }

    const data = await response.json();
    const entitlements = data.subscriber?.entitlements || {};

    // Check active entitlements
    for (const [key, entitlement] of Object.entries(entitlements)) {
      const ent = entitlement as { expires_date: string | null };
      const plan = ENTITLEMENT_TO_PLAN[key];
      if (plan) {
        const isActive =
          !ent.expires_date || new Date(ent.expires_date) > new Date();
        if (isActive) {
          return {
            plan,
            isActive: true,
            expiresAt: ent.expires_date,
          };
        }
      }
    }

    return { plan: Plan.FREE, isActive: false, expiresAt: null };
  } catch (error) {
    console.error("RevenueCat error:", error);
    return { plan: Plan.FREE, isActive: false, expiresAt: null };
  }
}

// ============================================
// WEBHOOK HANDLING
// ============================================

interface RevenueCatWebhookEvent {
  event: {
    type: string;
    app_user_id: string;
    entitlement_ids?: string[];
    product_id?: string;
    expiration_at_ms?: number;
  };
}

export async function handleWebhookEvent(
  event: RevenueCatWebhookEvent
): Promise<void> {
  const { type, app_user_id, entitlement_ids, expiration_at_ms } = event.event;

  console.log(`[RC Webhook] Event: ${type} for user: ${app_user_id}`);

  // Determine plan from entitlements
  let newPlan = Plan.FREE;
  if (entitlement_ids) {
    // Pro wins over Starter if both present
    for (const entId of entitlement_ids) {
      if (ENTITLEMENT_TO_PLAN[entId] === Plan.PRO) { newPlan = Plan.PRO; break; }
    }
    if (newPlan === Plan.FREE) {
      for (const entId of entitlement_ids) {
        if (ENTITLEMENT_TO_PLAN[entId] === Plan.STARTER) { newPlan = Plan.STARTER; break; }
      }
    }
  }

  // Parse the exact next renewal date from RevenueCat (milliseconds timestamp)
  // This is the precise date when the next charge will occur / subscription expires
  const nextRenewalAt = expiration_at_ms ? new Date(expiration_at_ms) : undefined;
  const subscriptionStartedAt = new Date(); // now = purchase/renewal moment

  switch (type) {
    case "INITIAL_PURCHASE":
      console.log(`[RC Webhook] New subscription: ${newPlan}, renews: ${nextRenewalAt?.toISOString()}`);
      await updateUserPlan(app_user_id, newPlan, { subscriptionStartedAt, nextRenewalAt });
      break;

    case "RENEWAL":
      console.log(`[RC Webhook] Renewal: ${newPlan}, next renewal: ${nextRenewalAt?.toISOString()}`);
      await updateUserPlan(app_user_id, newPlan, { subscriptionStartedAt, nextRenewalAt });
      break;

    case "PRODUCT_CHANGE":
      console.log(`[RC Webhook] Plan change → ${newPlan}`);
      await updateUserPlan(app_user_id, newPlan, { subscriptionStartedAt, nextRenewalAt });
      break;

    case "CANCELLATION":
      // Cancelled but still active until expiry — keep plan until EXPIRATION fires
      console.log(`[RC Webhook] Cancelled — keeping plan until expiry: ${nextRenewalAt?.toISOString()}`);
      break;

    case "EXPIRATION":
      // Subscription fully expired — downgrade to free
      console.log(`[RC Webhook] Subscription expired for ${app_user_id} — downgrading to free`);
      await updateUserPlan(app_user_id, Plan.FREE);
      break;

    case "BILLING_ISSUE":
      console.warn(`[RC Webhook] Billing issue for ${app_user_id} — monitoring`);
      break;

    case "UNCANCELLATION":
      // User re-subscribed before expiry
      console.log(`[RC Webhook] Uncancellation for ${app_user_id}`);
      await updateUserPlan(app_user_id, newPlan, { subscriptionStartedAt, nextRenewalAt });
      break;

    default:
      console.log(`[RC Webhook] Unhandled event type: ${type}`);
  }
}


// Verify webhook signature
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("RevenueCat webhook secret not configured");
    return true; // Allow in development
  }

  // RevenueCat uses a simple bearer token for webhook auth
  return signature === secret;
}

// Check if RevenueCat is configured
export function isRevenueCatConfigured(): boolean {
  return !!(
    process.env.REVENUECAT_API_KEY &&
    process.env.NEXT_PUBLIC_REVENUECAT_API_KEY
  );
}
