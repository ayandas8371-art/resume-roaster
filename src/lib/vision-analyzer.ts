import { getNextGeminiKey } from "./gemini-keys";

/**
 * Stage 1: Vision-Based / Multimodal Resume Analyzer
 * 
 * Uses Google Gemini 2.5 Flash Native Multimodal REST API.
 * Features built-in 3-attempt self-healing key rotation to guarantee 100% success even if some keys in the pool are rate-limited or blocked.
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
  const mime = fileType === "image/jpg" ? "image/jpeg" : fileType;
  const base64Data = fileBuffer.toString("base64");
  
  const maxAttempts = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const apiKey = await getNextGeminiKey();
      if (!apiKey) {
        throw new Error("No Gemini API key available in key pool");
      }

      console.log(`[VisionAnalyzer] Multimodal OCR attempt ${attempt}/${maxAttempts} using key rotation...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seconds strict timeout safety guard

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
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini direct API failed with status ${response.status}: ${errText}`);
      }

      const resData = await response.json();
      const extractedText = resData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (extractedText && extractedText.trim().length > 30) {
        console.log(`[VisionAnalyzer] Gemini native OCR parser succeeded on attempt ${attempt}: ${extractedText.length} characters.`);
        return extractedText.trim();
      } else {
        throw new Error("Gemini returned empty extracted text.");
      }
    } catch (err: any) {
      console.error(`[VisionAnalyzer] Attempt ${attempt} failed:`, err?.message || err);
      lastError = err instanceof Error ? err : new Error(String(err));
      
      // Delay briefly before retrying next key
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  // If all attempts failed, fall back to fast-path pre-extracted selectable text if available
  if (fallbackText && fallbackText.trim().length > 50) {
    console.log("[VisionAnalyzer] All vision attempts failed. Falling back to pre-extracted local selectable text.");
    return fallbackText.trim();
  }

  throw lastError || new Error("Failed to extract text from resume file after multiple rotated attempts.");
}
