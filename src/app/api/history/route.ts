import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ roasts: [] });
    }

    const supabase = createAdminClient();

    // ── Server-side plan gate ──────────────────────────────────────────────
    // History is a paid-only feature. Check the user's plan before returning data.
    const { data: userRow, error: userError } = await supabase
      .from("users")
      .select("plan")
      .eq("clerk_user_id", userId)
      .single();

    if (userError || !userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const plan: string = userRow.plan ?? "free";
    const isPaidUser = plan !== "free";

    if (!isPaidUser) {
      // Return a structured 403 so the client can show a proper upgrade prompt
      return NextResponse.json(
        { error: "history_locked", plan },
        { status: 403 }
      );
    }
    // ──────────────────────────────────────────────────────────────────────

    const { data: roasts, error } = await supabase
      .from("roast_reports")
      .select("id, created_at, role, industry, score, headline, plan")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ roasts });
  } catch (error) {
    console.error("History GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reportId } = await request.json();
    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    const supabase = createAdminClient();

    // ── Server-side plan gate (for individual report fetching too) ─────────
    const { data: userRow } = await supabase
      .from("users")
      .select("plan")
      .eq("clerk_user_id", userId)
      .single();

    const plan: string = userRow?.plan ?? "free";
    if (plan === "free") {
      return NextResponse.json({ error: "history_locked", plan }, { status: 403 });
    }
    // ──────────────────────────────────────────────────────────────────────

    const { data: report, error } = await supabase
      .from("roast_reports")
      .select("*")
      .eq("id", reportId)
      .eq("user_id", userId)
      .single();

    if (error || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error("History POST Error:", error);
    return NextResponse.json({ error: "Failed to fetch report detail" }, { status: 500 });
  }
}
