import OpenAI from "openai";
import { z } from "zod";
import { ROAST_SYSTEM_PROMPT, createRoastPrompt } from "./prompts";
import type { RoastResult } from "@/types";
import { getNextGeminiKey } from "./gemini-keys";

// ============================================
// AI CLIENT CONFIGURATION
// ============================================

// Zod schema for validating AI response
const burnSchema = z.object({
  quote: z.string(),
  burn: z.string(),
  fix: z.string(),
});

const roastResultSchema = z.object({
  score: z.number().min(0).max(100),
  headline: z.string(),
  burns: z.array(burnSchema).min(1).max(12),
  biggest_crime: z.string(),
  verdict: z.string(),
  fixed_summary: z.string(),
  fixed_bullets: z.array(z.string()).min(1).max(10),
});

type AIProvider = "gemini" | "groq" | "openrouter" | "nvidia";

interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseURL: string;
}

async function getAIConfig(): Promise<AIConfig> {
  // 1. Primary Engine: Gemini 2.5 Flash via Dynamic Key Rotation
  // This gives ultra-fast JSON generation with virtually unlimited free rate limits
  try {
    const geminiKey = await getNextGeminiKey();
    if (geminiKey) {
      return {
        provider: "gemini",
        apiKey: geminiKey,
        model: "gemini-2.5-flash",
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      };
    }
  } catch (error) {
    console.error("[AI] Failed to fetch Gemini key from rotation, trying fallbacks...", error);
  }

  // Try NVIDIA NIM as backup
  if (process.env.NVIDIA_NIM_API_KEY) {
    return {
      provider: "nvidia",
      apiKey: process.env.NVIDIA_NIM_API_KEY,
      model: process.env.NVIDIA_NIM_MODEL || "meta/llama-3.2-3b-instruct",
      baseURL: "https://integrate.api.nvidia.com/v1",
    };
  }

  // Try Groq as backup (Fast secondary)
  if (process.env.GROQ_API_KEY) {
    return {
      provider: "groq",
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      baseURL: "https://api.groq.com/openai/v1",
    };
  }

  // Try OpenRouter (Tertiary fallback)
  if (process.env.OPENROUTER_API_KEY) {
    return {
      provider: "openrouter",
      apiKey: process.env.OPENROUTER_API_KEY,
      model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat",
      baseURL: "https://openrouter.ai/api/v1",
    };
  }

  throw new Error(
    "No AI provider configured. Set GEMINI_API_KEY_1, NVIDIA_NIM_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY."
  );
}

function createAIClient(config: AIConfig): OpenAI {
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    defaultHeaders:
      config.provider === "openrouter"
        ? {
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            "X-Title": "Hired or Roasted",
          }
        : undefined,
  });
}

// ============================================
// ROAST GENERATION
// ============================================

export async function generateRoast(
  resumeText: string
): Promise<RoastResult> {
  const config = await getAIConfig();
  const client = createAIClient(config);

  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: config.model,
        messages: [
          { role: "system", content: ROAST_SYSTEM_PROMPT },
          { role: "user", content: createRoastPrompt(resumeText) },
        ],
        temperature: 0.8,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error("AI returned empty response");
      }

      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();

      // Parse and validate
      const parsed = JSON.parse(cleanContent);
      const validated = roastResultSchema.parse(parsed);

      return validated;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        // Wait before retry with exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt))
        );
        continue;
      }
    }
  }

  throw new Error(
    `AI generation failed after ${maxRetries + 1} attempts: ${lastError?.message}`
  );
}

// Check if any AI provider is available with REAL keys (not placeholders)
export function isAIConfigured(): boolean {
  const openrouter = process.env.OPENROUTER_API_KEY;
  const nvidia = process.env.NVIDIA_NIM_API_KEY;
  const grok = process.env.GROK_API_KEY;
  const anthropic = process.env.ANTHROPIC_API_KEY;
  
  // Check each key is present AND not a placeholder
  const isRealKey = (key: string | undefined) => {
    if (!key) return false;
    if (key.includes("YOUR_KEY") || key.includes("abc") || key.length < 10) return false;
    return true;
  };
  
  return isRealKey(openrouter) || isRealKey(nvidia) || isRealKey(grok) || isRealKey(anthropic) || isRealKey(process.env.GEMINI_API_KEY_1);
}

// Get current AI provider info
export async function getAIProviderInfo(): Promise<{ provider: string; model: string }> {
  try {
    const config = await getAIConfig();
    return { provider: config.provider, model: config.model };
  } catch {
    return { provider: "none", model: "none" };
  }
}
