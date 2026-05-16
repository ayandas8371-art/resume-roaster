"use client";

import { useState, useCallback } from "react";
import type { UploadResult } from "@/types";

interface UseUploadReturn {
  uploadFile: (file: File) => Promise<UploadResult | null>;
  isUploading: boolean;
  progress: number;
  error: string | null;
  reset: () => void;
}

export function useUpload(): UseUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  const uploadFile = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        // Client-side validation
        if (file.type !== "application/pdf") {
          throw new Error("Only PDF files are accepted");
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error("File too large. Maximum size is 5MB.");
        }

        setProgress(20);

        const formData = new FormData();
        formData.append("file", file);

        setProgress(40);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        setProgress(80);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Upload failed");
        }

        setProgress(100);
        return data as UploadResult;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed. Please try again.";
        setError(message);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  return { uploadFile, isUploading, progress, error, reset };
}
