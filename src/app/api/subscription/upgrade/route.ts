import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateUserPlan } from "@/lib/quota";
import { Plan } from "@/types";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase";

const VALID_PLANS: Plan[] = [Plan.STARTER, Plan.PRO];

// Map from string to enum
const PLAN_MAP: Record<string, Plan> = {
  starter: Plan.STARTER,
  pro: Plan.PRO,
};

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plan: planStr } = body;

    const newPlan = PLAN_MAP[planStr];
    if (!newPlan || !VALID_PLANS.includes(newPlan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'starter' or 'pro'." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    // 1. Update the user's plan and reset their quota
    await updateUserPlan(userId, newPlan);

    // 2. Fetch the updated user to confirm and return fresh data
    const supabase = createAdminClient();
    const { data: updatedUser, error: fetchError } = await supabase
      .from("users")
      .select("plan, quota_limit, quota_used")
      .eq("clerk_user_id", userId)
      .single();

    if (fetchError) {
      console.error("[Upgrade] Failed to fetch updated user:", fetchError.message);
    }

    console.log(`[Upgrade] User ${userId} upgraded to ${newPlan}`);

    return NextResponse.json({
      success: true,
      plan: updatedUser?.plan || newPlan,
      quota_limit: updatedUser?.quota_limit,
      quota_used: updatedUser?.quota_used ?? 0,
      message: `Successfully upgraded to ${newPlan} plan`,
    });
  } catch (error: any) {
    console.error("[Upgrade] Error:", error.message);
    return NextResponse.json(
      { error: "Failed to process upgrade. Please try again." },
      { status: 500 }
    );
  }
}
