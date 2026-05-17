import { getNextGeminiKey } from "./gemini-keys";

/**
 * Stage 1: Vision-Based / Multimodal Resume Analyzer
 * 
 * Uses Google Gemini 2.5 Flash Native Multimodal REST API.
 * This directly uploads base64 file data (PDF or Image) to Gemini for pixel-perfect OCR analysis.
 * Bypasses native binaries like node-canvas or pdfjs-dist which can cause Vercel out-of-memory crashes.
 */

const ANALYSIS_PROMPT = `You are an expert resume scanner. Your job is to read this resume file (PDF or Image) and extract EVERY SINGLE detail verbatim. 
Extract:
1. Contact information (Email, Phone, Links, Location).
2. Work History (Company names, Roles, Dates, and full Bullet Points verbatim).
3. Education history (Institutions, Degrees, Dates).
4. Skills, Certifications, and Projects.
5. Visual layout comments (Any alignment issues, font issues, or formatting crimes).

Return ALL details cleanly formatted as plain text.`;

export async function analyzeResumeWithVision(
  fileBuffer: Buffer,
  fallbackText: string,
  fileType: string = "application/pdf"
): Promise<string> {
  try {
    const apiKey = await getNextGeminiKey();
    if (!apiKey) {
      throw new Error("No Gemini API key available in key pool");
    }

    const mime = fileType === "image/jpg" ? "image/jpeg" : fileType;
    console.log(`[VisionAnalyzer] Triggering native Gemini multimodal OCR parse (${mime})...`);

    const base64Data = fileBuffer.toString("base64");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: ANALYSIS_PROMPT },
                {
                  inlineData: {
                    mimeType: mime,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini direct API failed with status ${response.status}: ${errText}`);
    }

    const resData = await response.json();
    const extractedText = resData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (extractedText && extractedText.trim().length > 30) {
      console.log(`[VisionAnalyzer] Gemini native OCR parser succeeded: ${extractedText.length} characters.`);
      return extractedText.trim();
    } else {
      throw new Error("Gemini returned empty extracted text.");
    }
  } catch (err: any) {
    console.error("[VisionAnalyzer] Native Gemini OCR parse failed:", err?.message || err);
    
    // If native Gemini upload fails, try fast-path selectable text fallback if available
    if (fallbackText && fallbackText.trim().length > 50) {
      console.log("[VisionAnalyzer] Falling back to pre-extracted local selectable text.");
      return fallbackText.trim();
    }
    
    throw err;
  }
}
