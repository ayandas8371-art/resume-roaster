import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ensureUser } from "@/lib/auth";
import { checkQuota, decrementQuota, logUsage } from "@/lib/quota";
import { isAIConfigured } from "@/lib/ai";
import { isSupabaseConfigured, createAdminClient } from "@/lib/supabase";
import { sendRoastEmail } from "@/lib/email";
import { ROAST_SYSTEM_PROMPT, FULL_ROAST_PROMPT } from "@/lib/prompts";
import { callModel } from "@/lib/model-router";
import { z } from "zod";
import type { RoastResult } from "@/types";

export const maxDuration = 60; // 60 second timeout for AI generation
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Auth check using our helper (supports local dev fallback)
    const { getAuthUserId } = require("@/lib/auth");
    const userId = await getAuthUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // Validate request body - CRITICAL: role must be destructured here
    const body = await request.json();
    const { resumeText, fileName, industry, role } = body;

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json(
        { error: "Resume text is required", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    if (resumeText.length < 50) {
      return NextResponse.json(
        {
          error: "Resume text is too short. Please upload a complete resume.",
          code: "TEXT_TOO_SHORT",
        },
        { status: 400 }
      );
    }

    if (resumeText.length > 20000) {
      return NextResponse.json(
        {
          error: "Resume text is too long. Please upload a shorter document.",
          code: "TEXT_TOO_LONG",
        },
        { status: 400 }
      );
    }

    // Ensure user exists
    const user = await ensureUser(userId);

    // Check quota
    const usage = await checkQuota(userId);
    if (usage.roasts_remaining <= 0) {
      return NextResponse.json(
        {
          error: "You've used all your roasts. Upgrade your plan for more!",
          code: "QUOTA_EXCEEDED",
          usage,
        },
        { status: 403 }
      );
    }

    // Check AI configuration
    if (!isAIConfigured()) {
      // Return a demo roast if AI is not configured
      const demoRoast: RoastResult = {
        score: 42,
        headline:
          "Your resume reads like a LinkedIn motivational post written during a caffeine overdose.",
        burns: [
          {
            quote: "Results-driven team player",
            burn: "This phrase has appeared on so many resumes it should qualify for public housing.",
            fix: "Increased conversion rate by 28% through redesigning onboarding flows.",
          },
          {
            quote: "Passionate about innovation",
            burn: "Translation: you watched one TED talk and made it your personality.",
            fix: "Architected microservices migration reducing deployment time from 2 hours to 15 minutes.",
          },
          {
            quote: "Strong communication skills",
            burn: "Yet somehow your resume fails to communicate a single concrete achievement.",
            fix: "Led cross-functional team of 8 to deliver $2M product launch 2 weeks ahead of schedule.",
          },
          {
            quote: "Managed various projects",
            burn: "'Various' is doing more heavy lifting here than you ever did at work.",
            fix: "Managed 5 concurrent projects totaling $1.2M in budget with 100% on-time delivery.",
          },
          {
            quote: "Proficient in Microsoft Office",
            burn: "Congratulations, you can open Excel. So can my grandmother.",
            fix: "Built automated financial models in Excel reducing monthly reporting time by 60%.",
          },
          {
            quote: "Detail-oriented professional",
            burn: "The irony of using a cliché to describe your attention to detail is truly chef's kiss.",
            fix: "Reduced QA defect rate by 45% through implementing automated testing pipelines.",
          },
        ],
        biggest_crime:
          "Not a single measurable outcome in the entire document. Your resume is essentially a list of job descriptions, not achievements.",
        verdict:
          "You're probably more capable than this resume suggests. Which is terrifying, because this resume suggests very little.",
        fixed_summary:
          "Results-oriented professional with proven track record of delivering measurable business outcomes through data-driven decision making and cross-functional team leadership.",
        fixed_bullets: [
          "Increased conversion rate by 28% through redesigning user onboarding flows",
          "Managed $1.2M project portfolio with 100% on-time delivery record",
          "Reduced operational costs by 35% through process automation initiatives",
          "Led cross-functional team of 8 engineers to deliver product 2 weeks ahead of schedule",
        ],
      };

      // Still decrement quota even for demo
      await decrementQuota(userId);

      return NextResponse.json({
        roast: demoRoast,
        usage: {
          ...usage,
          quota_used: usage.quota_used + 1,
          roasts_remaining: usage.roasts_remaining - 1,
        },
        isDemo: true,
      });
    }

    // Generate roast via Multi-Model Router (Self-healing structure)
    let roast: RoastResult | null = null;
    let lastError: Error | null = null;
    const maxRetries = 0; // No outer retries since callModel has 5 highly resilient internal attempts (3x Gemini, NIM, OpenRouter)

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const modelResponse = await callModel(
          ROAST_SYSTEM_PROMPT, 
          FULL_ROAST_PROMPT(resumeText, role || industry), 
          user.plan
        );

        if (!modelResponse) {
          throw new Error("AI returned empty response");
        }

        let cleanContent = modelResponse.trim();
        // Robust extraction: isolate everything between the first '{' and the last '}'
        const startIndex = cleanContent.indexOf("{");
        const endIndex = cleanContent.lastIndexOf("}");
        
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          cleanContent = cleanContent.substring(startIndex, endIndex + 1);
        } else {
          cleanContent = cleanContent.replace(/```json/g, "").replace(/```/g, "").trim();
        }

        // Aggressive JSON rescue: Fix common AI hallucinations
        // 1. Remove trailing commas before closing brackets/braces (very common hallucination)
        cleanContent = cleanContent.replace(/,\s*([\]}])/g, '$1');
        // 2. Remove unescaped control characters like literal newlines inside strings
        cleanContent = cleanContent.replace(/[\u0000-\u001F]+/g, ' ');

        try {
          roast = JSON.parse(cleanContent) as RoastResult;
          break; // Success! Exit the retry loop instantly
        } catch (parseError) {
          console.error(`[Roast API] Attempt ${attempt + 1} Failed to parse JSON:`, cleanContent.substring(0, 200) + "...");
          throw new Error("AI returned malformed data."); // Caught by the outer catch to trigger retry
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`[Roast API] Attempt ${attempt + 1} failed: ${lastError.message}`);
        
        if (attempt < maxRetries) {
          // Fast backoff before retry (100ms, 200ms)
          await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, attempt)));
          continue;
        }
      }
    }

    if (!roast) {
      throw new Error(`AI failed to format the report correctly after ${maxRetries + 1} attempts. Please try again.`);
    }

    // Decrement quota
    const quotaDeducted = await decrementQuota(userId);
    if (!quotaDeducted) {
      return NextResponse.json(
        {
          error: "Quota exceeded. Please upgrade your plan.",
          code: "QUOTA_EXCEEDED",
        },
        { status: 403 }
      );
    }

    // Save roast to database - non-blocking, user gets result regardless
    let roastId: string | undefined;
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient();
        const { data: savedRoast, error: saveError } = await supabase
          .from("roast_reports")
          .insert({
            user_id: userId,
            role: role || "General",
            industry: industry || "Tech",
            score: roast.score,
            headline: roast.headline,
            roast_data: roast,
            plan: user?.plan || "free",
          })
          .select("id")
          .single();

        if (saveError) {
          console.error("Supabase Save Error (non-fatal):", saveError.message);
        } else {
          roastId = savedRoast?.id;
          console.log(`[Roast] Saved to DB with id: ${roastId}`);
        }
      } else {
        console.warn("[Roast] Supabase not configured — skipping DB save. Check your .env.local SUPABASE_SERVICE_ROLE_KEY.");
      }
    } catch (saveErr: any) {
      console.error("[Roast] DB save threw (non-fatal):", saveErr.message);
    }

    // Log usage
    await logUsage(user.id, "roast_generated", {
      score: roast.score,
      fileName,
    });

    // Send email notification (Background)
    try {
      const email = user?.email;
      if (email && email !== "demo@example.com" && email !== "unknown@example.com") {
        const nameFallback = email.split("@")[0] || "User";
        // We don't await this to keep the API response fast
        sendRoastEmail(email, nameFallback, roast.score, roast.headline);
      }
    } catch (err) {
      console.error("Failed to trigger email notification:", err);
    }

    const updatedUsage = await checkQuota(userId);

    return NextResponse.json({
      id: roastId,
      roast,
      usage: updatedUsage,
      isDemo: false,
    });
  } catch (error) {
    console.error("Roast error:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    // Handle specific error types
    if (message.includes("timeout") || message.includes("ETIMEDOUT")) {
      return NextResponse.json(
        {
          error:
            "AI is taking too long to respond. Please try again in a moment.",
          code: "AI_TIMEOUT",
        },
        { status: 504 }
      );
    }

    if (message.includes("rate limit") || message.includes("429")) {
      return NextResponse.json(
        {
          error:
            "We're getting too many requests right now. Please try again in a minute.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `Internal Error: ${message}`, code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
