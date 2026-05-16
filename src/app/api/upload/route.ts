import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ensureUser } from "@/lib/auth";
import { analyzeResumeWithVision } from "@/lib/vision-analyzer";

export const maxDuration = 60; // 60s - Vision analysis takes longer

export async function POST(request: NextRequest) {
  try {
    // Auth check using our helper (supports local dev fallback)
    const { getAuthUserId } = require("@/lib/auth");
    const userId = await getAuthUserId();
    
    if (!userId) {
      console.error("[Upload] Unauthorized access attempt. Session not found.");
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }
    console.log(`[Upload] Authenticated user: ${userId}`);

    // Get the form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided", code: "NO_FILE" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF, JPG, PNG, and WebP files are accepted", code: "INVALID_TYPE" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size is 10MB.",
          code: "FILE_TOO_LARGE",
        },
        { status: 400 }
      );
    }

    // Ensure user exists in database
    await ensureUser(userId);

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ============================================
    // TWO-STAGE PIPELINE
    // Stage 1: Try Vision Model (PRIMARY)
    // Stage 2: Fallback to pdf-parse (BACKUP)
    // ============================================

    let extractedText: string = "";

    // Diagnostics for API keys
    const nimKey = process.env.NVIDIA_NIM_API_KEY;
    console.log(`[Upload] NVIDIA NIM Key check: ${nimKey ? "Found (Starts with " + nimKey.substring(0, 8) + ")" : "NOT FOUND"}`);

    // PRIMARY: Vision-based extraction via Llama 3.2 Vision 90B
    try {
      console.log(`[Upload] Starting vision-based extraction for type: ${file.type}...`);
      extractedText = await analyzeResumeWithVision(buffer, "", file.type);
      if (extractedText && extractedText.length > 50) {
        console.log(`[Upload] Vision extraction succeeded: ${extractedText.length} chars`);
      } else {
        console.log("[Upload] Vision extraction returned insufficient text, falling back...");
      }
    } catch (visionErr) {
      console.error("[Upload] Vision extraction failed:", visionErr);
    }

    // FALLBACK: If vision returned nothing, try pdf-parse (only if it's actually a PDF)
    if ((!extractedText || extractedText.trim().length < 50) && file.type === "application/pdf") {
      try {
        console.log("[Upload] Falling back to standard pdf-parse...");
        const pdfParse = require("pdf-parse");
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text || "";
        console.log(`[Upload] pdf-parse extraction successful: ${extractedText.length} chars`);
      } catch (parseErr) {
        console.error("[Upload] pdf-parse fallback failed:", parseErr);
      }
    }

    // If BOTH methods failed
    if (!extractedText || extractedText.trim().length < 30) {
      return NextResponse.json(
        {
          error:
            "Failed to extract text from the PDF. Please make sure it's a valid, text-based PDF document or try a different file.",
          code: "EXTRACTION_FAILED",
        },
        { status: 400 }
      );
    }

    // Privacy: PDF buffer is discarded after this point — never stored.
    return NextResponse.json({
      text: extractedText.trim(),
      fileName: file.name,
      storageUrl: null,
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred during upload.",
        code: "INTERNAL_ERROR",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
