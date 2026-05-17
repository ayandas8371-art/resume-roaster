import OpenAI from "openai";
import { getNextGeminiKey } from "./gemini-keys";

/**
 * Multi-Provider Model Router with Self-Healing JSON Validation
 * Prioritizes Gemini 2.5 Flash (via dynamic key rotation) for massive speed.
 * Falls back to NVIDIA NIM and OpenRouter instantly if generation fails or fails JSON validation.
 */

function isRealKey(key: string | undefined): boolean {
  if (!key) return false;
  if (key.includes("YOUR_KEY") || key === "sk-or-v1-abc" || key.length < 10) return false;
  return true;
}

function isValidJSON(text: string | null | undefined): boolean {
  if (!text) return false;
  try {
    let clean = text.trim();
    // Isolate JSON object
    const startIndex = clean.indexOf("{");
    const endIndex = clean.lastIndexOf("}");
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      clean = clean.substring(startIndex, endIndex + 1);
    } else {
      clean = clean.replace(/```json/g, "").replace(/```/g, "").trim();
    }
    
    // Aggressive JSON rescue checks
    clean = clean.replace(/,\s*([\]}])/g, '$1');
    clean = clean.replace(/[\u0000-\u001F]+/g, ' ');
    
    JSON.parse(clean);
    return true;
  } catch {
    return false;
  }
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

  // 1. Try Gemini 2.5 Flash (Primary Engine for blazing speed) with multi-key self-healing rotation
  const maxGeminiAttempts = 3;
  for (let gAttempt = 0; gAttempt < maxGeminiAttempts; gAttempt++) {
    try {
      const geminiKey = await getNextGeminiKey();
      if (geminiKey) {
        console.log(`[ModelRouter] Attempting Gemini 2.5 Flash (Attempt ${gAttempt + 1}/${maxGeminiAttempts})...`);
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
          max_tokens: 3000,
          response_format: { type: "json_object" },
        });
        const text = response.choices[0]?.message?.content;
        if (text) {
          if (isValidJSON(text)) {
            console.log("[ModelRouter] Gemini succeeded with valid JSON.");
            return text;
          } else {
            console.warn("[ModelRouter] Gemini succeeded but returned invalid JSON.");
            throw new Error("Invalid JSON structure returned by primary engine.");
          }
        }
      }
    } catch (e) {
      console.error(`[ModelRouter] Gemini attempt ${gAttempt + 1} failed:`, e instanceof Error ? e.message : e);
      if (gAttempt < maxGeminiAttempts - 1) {
        // Pause 100ms before rotating to a fresh key
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  // 2. Try NVIDIA NIM (Fallback) with strict 4-second timeout to avoid Vercel 504
  if (nvidiaClient) {
    const models = [
      process.env.NVIDIA_NIM_MODEL || "meta/llama-3.2-3b-instruct",
      "meta/llama-3.1-8b-instruct"
    ];

    for (const model of models) {
      try {
        console.log(`[ModelRouter] Attempting NVIDIA NIM (${model}) with 4s timeout...`);
        const response = await nvidiaClient.chat.completions.create({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: 3000,
          response_format: { type: "json_object" },
        }, { timeout: 4000 }); // 4 second timeout guard
        
        const text = response.choices[0]?.message?.content;
        if (text) {
          if (isValidJSON(text)) {
            console.log(`[ModelRouter] NVIDIA NIM (${model}) succeeded with valid JSON.`);
            return text;
          } else {
            console.warn(`[ModelRouter] NVIDIA NIM (${model}) succeeded but returned invalid JSON. Trying next fallback...`);
            throw new Error("Invalid JSON structure returned by NIM fallback.");
          }
        }
      } catch (e) {
        console.error(`[ModelRouter] NVIDIA NIM (${model}) failed:`, e instanceof Error ? e.message : e);
      }
    }
  }

  // 3. Try OpenRouter (Tertiary Fallback) with strict 4-second timeout to avoid Vercel 504
  if (openRouterClient) {
    try {
      console.log("[ModelRouter] Attempting OpenRouter with 4s timeout...");
      const response = await openRouterClient.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      }, { timeout: 4000 }); // 4 second timeout guard
      
      const text = response.choices[0]?.message?.content;
      if (text) {
        if (isValidJSON(text)) {
          console.log("[ModelRouter] OpenRouter succeeded with valid JSON.");
          return text;
        } else {
          console.warn("[ModelRouter] OpenRouter succeeded but returned invalid JSON.");
          throw new Error("Invalid JSON structure returned by OpenRouter.");
        }
      }
    } catch (e) {
      console.error("[ModelRouter] OpenRouter failed:", e instanceof Error ? e.message : e);
    }
  }

  throw new Error("No AI providers are currently configured or available. Please add a valid GEMINI_API_KEY_1 to your .env.local file.");
}

