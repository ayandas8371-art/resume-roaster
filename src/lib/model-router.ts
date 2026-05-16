import OpenAI from "openai";
import { getNextGeminiKey } from "./gemini-keys";

/**
 * Multi-Provider Model Router
 * Prioritizes Gemini 2.5 Flash (via dynamic key rotation) for massive speed.
 * Falls back to NVIDIA NIM and OpenRouter.
 */

function isRealKey(key: string | undefined): boolean {
  if (!key) return false;
  if (key.includes("YOUR_KEY") || key === "sk-or-v1-abc" || key.length < 10) return false;
  return true;
}

const nvidiaClient = isRealKey(process.env.NVIDIA_NIM_API_KEY)
  ? new OpenAI({
      apiKey: process.env.NVIDIA_NIM_API_KEY!,
      baseURL: "https://integrate.api.nvidia.com/v1",
    })
  : null;

const openRouterClient = isRealKey(process.env.OPENROUTER_API_KEY)
  ? new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Roast My Resume",
      },
    })
  : null;

export async function callModel(systemPrompt: string, userPrompt: string, plan: string): Promise<string> {

  // 1. Try Gemini 2.5 Flash (Primary Engine for blazing speed)
  try {
    const geminiKey = await getNextGeminiKey();
    if (geminiKey) {
      console.log(`[ModelRouter] Attempting Gemini 2.5 Flash for Generation...`);
      const geminiClient = new OpenAI({
        apiKey: geminiKey,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      });
      const response = await geminiClient.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      });
      const text = response.choices[0]?.message?.content;
      if (text) {
        console.log("[ModelRouter] Gemini succeeded.");
        return text;
      }
    }
  } catch (e) {
    console.error("[ModelRouter] Gemini failed:", e instanceof Error ? e.message : e);
  }

  // 2. Try NVIDIA NIM (Fallback)
  if (nvidiaClient) {
    const models = [
      process.env.NVIDIA_NIM_MODEL || "meta/llama-3.2-3b-instruct",
      "meta/llama-3.1-8b-instruct"
    ];

    for (const model of models) {
      try {
        console.log(`[ModelRouter] Attempting NVIDIA NIM (${model})...`);
        const response = await nvidiaClient.chat.completions.create({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: 4000,
          response_format: { type: "json_object" },
        });
        const text = response.choices[0]?.message?.content;
        if (text) {
          console.log("[ModelRouter] NVIDIA NIM succeeded.");
          return text;
        }
      } catch (e) {
        console.error(`[ModelRouter] NVIDIA NIM (${model}) failed:`, e instanceof Error ? e.message : e);
      }
    }
  }

  // 3. Try OpenRouter (Tertiary Fallback)
  if (openRouterClient) {
    try {
      console.log("[ModelRouter] Attempting OpenRouter...");
      const response = await openRouterClient.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      });
      const text = response.choices[0]?.message?.content;
      if (text) {
        console.log("[ModelRouter] OpenRouter succeeded.");
        return text;
      }
    } catch (e) {
      console.error("[ModelRouter] OpenRouter failed:", e instanceof Error ? e.message : e);
    }
  }

  throw new Error("No AI providers are currently configured or available. Please add a valid GEMINI_API_KEY_1 to your .env.local file.");
}
