"use client";

import { useState, useCallback } from "react";
import type { RoastResult, UsageStats } from "@/types";

interface UseRoastReturn {
  generateRoast: (
    resumeText: string,
    fileName?: string
  ) => Promise<RoastResult | null>;
  isGenerating: boolean;
  roast: RoastResult | null;
  usage: UsageStats | null;
  error: string | null;
  isDemo: boolean;
  reset: () => void;
}

export function useRoast(): UseRoastReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [roast, setRoast] = useState<RoastResult | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setRoast(null);
    setUsage(null);
    setError(null);
    setIsDemo(false);
  }, []);

  const generateRoast = useCallback(
    async (
      resumeText: string,
      fileName?: string
    ): Promise<RoastResult | null> => {
      setIsGenerating(true);
      setError(null);
      setRoast(null);

      try {
        const response = await fetch("/api/roast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, fileName }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to generate roast");
        }

        setRoast(data.roast);
        setUsage(data.usage);
        setIsDemo(data.isDemo || false);
        return data.roast;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to generate roast. Please try again.";
        setError(message);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return { generateRoast, isGenerating, roast, usage, error, isDemo, reset };
}
