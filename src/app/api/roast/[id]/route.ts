import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { isSupabaseConfigured, createAdminClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Use getAuthUserId for consistent dev fallback support
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    const supabase = createAdminClient();

    // FIX 1: Correct table name is "roast_reports" not "roasts"
    // FIX 2: Filter by clerk userId directly (user_id column stores clerk_user_id)
    const { data: roast, error } = await supabase
      .from("roast_reports")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (error || !roast) {
      console.error(`[Roast GET] Not found — id: ${params.id}, user: ${userId}`, error?.message);
      return NextResponse.json(
        { error: "Roast not found" },
        { status: 404 }
      );
    }

    // Normalize response to what the result page expects
    return NextResponse.json({
      id: roast.id,
      roast_json: roast.roast_data,
      score: roast.score,
      headline: roast.headline,
      role: roast.role,
      industry: roast.industry,
      plan: roast.plan,
      created_at: roast.created_at,
    });
  } catch (error: any) {
    console.error("Fetch roast error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch roast", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
