import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateUserPlan } from "@/lib/quota";
import { Plan } from "@/types";

const PLAN_MAP: Record<string, Plan> = {
  free: Plan.FREE,
  starter: Plan.STARTER,
  pro: Plan.PRO,
};

/**
 * POST /api/subscription/sync
 * Called by the client after RevenueCat confirms a purchase.
 * Syncs the RC-confirmed plan into our Supabase users table.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan: planStr } = await request.json();
    const newPlan = PLAN_MAP[planStr as string];

    if (!newPlan) {
      return NextResponse.json({ error: "Invalid plan value" }, { status: 400 });
    }

    await updateUserPlan(userId, newPlan);

    console.log(`[Sync] User ${userId} → plan synced to: ${newPlan}`);

    return NextResponse.json({
      success: true,
      plan: newPlan,
      message: `Plan synced to ${newPlan}`,
    });
  } catch (error: any) {
    console.error("[Sync] Error syncing plan:", error.message);
    return NextResponse.json(
      { error: "Failed to sync plan" },
      { status: 500 }
    );
  }
}
