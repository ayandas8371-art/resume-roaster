import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export async function getNextGeminiKey(): Promise<string> {
  // Dynamically load all available Gemini keys from environment variables
  // This automatically scales if you add 23, 30, or even 50 keys!
  const keys = Array.from({ length: 50 }, (_, i) => process.env[`GEMINI_API_KEY_${i + 1}`]).filter(Boolean) as string[];

  if (keys.length === 0) {
    throw new Error("No Gemini API keys found in environment variables");
  }

  try {
    // Atomically increment the global counter in Redis
    const count = await redis.incr("gemini_key_rotation_counter");
    
    // Calculate the correct 0-indexed position
    // (count - 1) ensures count 1 -> index 0, count 15 -> index 14, count 16 -> index 0
    const index = (count - 1) % keys.length;
    
    console.log(`[Gemini Keys] Rotating to Key ${index + 1} of ${keys.length} (Global Request Count: ${count})`);
    
    return keys[index];
  } catch (error) {
    console.error("[Gemini Keys] Redis error, falling back to random key:", error);
    // Safe fallback if Redis happens to be down
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
  }
}
