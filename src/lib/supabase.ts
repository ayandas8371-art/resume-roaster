import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export interface RoastReport {
  id: string;
  user_id: string;
  created_at: string;
  role: string;
  industry: string;
  score: number;
  headline: string;
  roast_data: any;
  plan: string;
}

// Server-side Supabase client using service role key
// This bypasses RLS for server-side operations
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!(url && key && url.startsWith("https://") && key.length > 100);
}
