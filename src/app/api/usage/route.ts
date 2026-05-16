import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { checkQuota } from "@/lib/quota";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET(_request: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        used: 0,
        quota: 2,
        remaining: 2,
        resetDate: null,
        plan: "free",
        warning: "Supabase not configured",
      });
    }

    // checkQuota handles rolling auto-reset internally for free users
    const stats = await checkQuota(userId) as any;

    return NextResponse.json({
      used: stats.quota_used,
      quota: stats.quota_limit,
      remaining: stats.roasts_remaining,
      resetDate: stats.quota_reset_at ?? null,
      plan: stats.plan,
      userId, // for debugging
    });
  } catch (error) {
    console.error("[Usage API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}
