import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient, isSupabaseConfigured } from "./supabase";
import type { User } from "@/types";
import { Plan } from "@/types";

// ============================================
// AUTH HELPERS
// ============================================

// Get the current authenticated user's Clerk ID
export async function getAuthUserId(): Promise<string | null> {
  try {
    const authData = await auth();
    const userId = authData.userId;
    
    // Fallback for local development
    if (!userId && process.env.NODE_ENV === "development") {
      console.warn("[Auth] No session found, using developer fallback.");
      // Using your specific ID from the database to ensure connection
      return "user_3DfNC1YMfi9QMe47qXutvm186eU";
    }
    
    return userId;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Auth] Clerk error, using dev-guest fallback.");
      return "dev-guest-user";
    }
    return null;
  }
}

// Require authentication - throws if not authenticated
export async function requireAuth(): Promise<string> {
  const userId = await getAuthUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

// Ensure user exists in Supabase, create if not
export async function ensureUser(clerkUserId: string): Promise<User> {
  if (!isSupabaseConfigured()) {
    // Return a mock user if Supabase isn't configured
    return {
      id: "mock-id",
      clerk_user_id: clerkUserId,
      email: "demo@example.com",
      plan: Plan.FREE,
      quota_limit: 2,
      quota_used: 0,
      quota_reset_at: null,
      created_at: new Date().toISOString(),
    };
  }

  const supabase = createAdminClient();

  // Try to find existing user
  const { data: existing, error: findError } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (existing && !findError) {
    return existing as User;
  }

  // Get email from Clerk
  let email = "unknown@example.com";
  try {
    const clerkUser = await currentUser();
    email = clerkUser?.emailAddresses?.[0]?.emailAddress || email;
  } catch {
    // Clerk may not be available in all contexts
  }

  // Create new user
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

  if (createError) {
    // If a concurrent request just created the user, we'll get a unique constraint error (23505).
    // In that case, simply fetch and return the newly created user!
    if (createError.code === "23505" || createError.message?.includes("duplicate key")) {
      const { data: concurrentExisting } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_user_id", clerkUserId)
        .single();
        
      if (concurrentExisting) {
        return concurrentExisting as User;
      }
    }
    
    throw new Error(`Failed to create user: ${createError.message}`);
  }

  return newUser as User;
}

// Get user by Clerk ID
export async function getUserByClerkId(
  clerkUserId: string
): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (error || !data) return null;
  return data as User;
}
