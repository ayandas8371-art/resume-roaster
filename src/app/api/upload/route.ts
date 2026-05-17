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
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF, JPG, PNG, and WebP files are accepted", code: "INVALID_TYPE" },
        { status: 400 }
      );
    }

    // Normalize standard MIME types for robust downstream processing
    const fileMimeType = file.type === "image/jpg" ? "image/jpeg" : file.type;

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
    // OPTIMIZED TWO-STAGE PIPELINE
    // Stage 1: Ultra-fast standard pdf-parse first for PDFs (native selectable text)
    // Stage 2: Vision Model for images (JPG/PNG) and scanned PDFs
    // ============================================

    let extractedText: string = "";

    // 1. FAST PATH: Attempt standard text parsing first if it is a native PDF
    if (file.type === "application/pdf") {
      try {
        console.log("[Upload] Running fast-path standard pdf-parse first...");
        const pdfParse = require("pdf-parse");
        const pdfData = await pdfParse(buffer);
        const text = pdfData.text || "";
        if (text && text.trim().length >= 200) {
          extractedText = text;
          console.log(`[Upload] Fast-path standard parsing succeeded: ${extractedText.length} chars. Skipping slow vision pipeline!`);
        } else {
          console.log("[Upload] Fast-path standard parsing returned insufficient text (possibly a scanned PDF). Falling back to Vision.");
        }
      } catch (parseErr) {
        console.error("[Upload] Fast-path standard parsing failed:", parseErr);
      }
    }

    // 2. VISION PATH: Fallback to slow OCR vision model only for scanned PDFs or images (JPG/PNG/WebP)
    if (!extractedText || extractedText.trim().length < 200) {
      try {
        console.log(`[Upload] Executing Vision model extraction for type: ${fileMimeType}...`);
        extractedText = await analyzeResumeWithVision(buffer, "", fileMimeType);
        if (extractedText && extractedText.length > 50) {
          console.log(`[Upload] Vision extraction succeeded: ${extractedText.length} chars`);
        } else {
          console.log("[Upload] Vision extraction returned insufficient text.");
        }
      } catch (visionErr) {
        console.error("[Upload] Vision extraction failed:", visionErr);
      }
    }

    // If BOTH methods failed
    if (!extractedText || extractedText.trim().length < 30) {
      return NextResponse.json(
        {
          error:
            "Failed to extract text from your resume file. Please ensure it is a valid, high-resolution document (PDF, PNG, JPG, or WebP) and try again.",
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
