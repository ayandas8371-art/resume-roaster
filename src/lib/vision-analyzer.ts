import OpenAI from "openai";
import { createCanvas } from "canvas";
import { getNextGeminiKey } from "./gemini-keys";

/**
 * Stage 1: Vision-Based Resume Analyzer
 * 
 * Uses Gemini 2.5 Flash.
 * Optimized for Node.js with pdfjs-dist v3.x and canvas.
 */

const VISION_MODEL = "gemini-2.5-flash";

const ANALYSIS_PROMPT = `You are an expert resume analyst. Your task is to extract EVERY SINGLE DETAIL from this resume image.
Extract:
1. All contact info and personal links.
2. Full work history with exact bullet points.
3. Complete education details.
4. All skills and certifications.
5. Projects and other details.

Analyze layout/formatting:
- Professionalism of the design.
- Any visual alignment or hierarchy issues.

EXTRACT EVERYTHING VERBATIM.`;

async function createGeminiClient() {
  const apiKey = await getNextGeminiKey();
  return new OpenAI({
    apiKey: apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
}

async function pdfToImages(pdfBuffer: Buffer): Promise<string[]> {
  try {
    console.log("[VisionAnalyzer] Rendering PDF with pdfjs-dist v3...");
    
    // Use require for the CJS build of pdfjs-dist
    const pdfjs = require("pdfjs-dist/build/pdf.js");
    
    // Disable worker entirely for stability in Next.js RSC/Server context
    pdfjs.GlobalWorkerOptions.workerSrc = "";
    
    const data = new Uint8Array(pdfBuffer);
    const loadingTask = pdfjs.getDocument({
      data,
      disableWorker: true,
      verbosity: 0
    });
    
    const pdfDocument = await loadingTask.promise;
    const images: string[] = [];
    const numPages = Math.min(pdfDocument.numPages, 3);
    
    for (let i = 1; i <= numPages; i++) {
      console.log(`[VisionAnalyzer] Processing page ${i}/${numPages}...`);
      const page = await pdfDocument.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext("2d");
      
      await page.render({
        canvasContext: context as any,
        viewport: viewport,
      }).promise;
      
      images.push(canvas.toBuffer("image/png").toString("base64"));
    }

    return images;
  } catch (error) {
    console.error("[VisionAnalyzer] PDF rendering failed:", error instanceof Error ? error.message : error);
    return [];
  }
}

async function callGeminiVision(content: any[]): Promise<string> {
  console.log(`[VisionAnalyzer] Sending to ${VISION_MODEL}...`);
  const client = await createGeminiClient();
  const response = await client.chat.completions.create({
    model: VISION_MODEL,
    messages: [{ role: "user", content }],
    max_tokens: 4000,
    temperature: 0.1,
  });
  return response.choices[0]?.message?.content || "";
}

export async function analyzeResumeWithVision(
  fileBuffer: Buffer,
  fallbackText: string,
  fileType: string = "application/pdf"
): Promise<string> {
  // 1. Try Vision Path (Images or PDF)
  try {
    let pageImages: string[] = [];
    
    if (fileType.startsWith("image/")) {
      console.log(`[VisionAnalyzer] Direct image upload detected (${fileType}). Processing and resizing image...`);
      try {
        const { loadImage } = require("canvas");
        const img = await loadImage(fileBuffer);
        
        const maxWidth = 1200;
        const maxHeight = 1600;
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
          console.log(`[VisionAnalyzer] Resizing image from ${img.width}x${img.height} to ${width}x${height}`);
        }
        
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        // Export to a highly compressed JPEG buffer to keep payload small and fast
        const optimizedBuffer = canvas.toBuffer("image/jpeg", { quality: 0.85 });
        pageImages = [optimizedBuffer.toString("base64")];
      } catch (resizeErr) {
        console.error("[VisionAnalyzer] Image resizing/loading failed, falling back to raw buffer:", resizeErr);
        pageImages = [fileBuffer.toString("base64")];
      }
    } else if (fileType === "application/pdf") {
      pageImages = await pdfToImages(fileBuffer);
    }

    if (pageImages.length > 0) {
      // Determine the precise mime type for the Data URI based on what we got
      let mimeForDataURI = fileType.startsWith("image/") ? fileType : "image/png";
      // Normalize image/jpg to image/jpeg for strict API standard compliance
      if (mimeForDataURI === "image/jpg") {
        mimeForDataURI = "image/jpeg";
      }
      
      const content = [
        { type: "text", text: ANALYSIS_PROMPT },
        ...pageImages.map(img => ({
          type: "image_url",
          image_url: { url: `data:${mimeForDataURI};base64,${img}` }
        }))
      ];
      const result = await callGeminiVision(content);
      if (result && result.length > 100) return result;
    }
  } catch (err) {
    console.error("[VisionAnalyzer] Vision path failed:", err);
  }

  // 2. Try Text Path (Gemini analysis of extracted text)
  if (fallbackText && fallbackText.length > 50) {
    try {
      console.log("[VisionAnalyzer] Using Gemini on raw text...");
      const result = await callGeminiVision([
        { type: "text", text: `${ANALYSIS_PROMPT}\n\nRAW TEXT:\n${fallbackText}` }
      ]);
      return result || fallbackText;
    } catch (err) {
      console.error("[VisionAnalyzer] Text path failed:", err);
    }
  }

  // 3. Absolute Fallback: Local extraction (only for PDFs)
  if (fileType === "application/pdf") {
    try {
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(fileBuffer);
      return data.text || fallbackText;
    } catch (e) {
      return fallbackText;
    }
  }

  return fallbackText;
}
