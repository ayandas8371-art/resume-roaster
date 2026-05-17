"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, AlertCircle, Loader2, Flame, Lock, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { UsageStats } from "@/types";

interface UploadZoneProps {
  usage: UsageStats | null;
}

const LOADING_MESSAGES = [
  "Reading your resume...",
  "Finding every cliché...",
  "Calculating damage score...",
  "Preparing your roast...",
];

const INDUSTRIES = [
  "Tech",
  "Finance",
  "Marketing",
  "Healthcare",
  "Law",
  "Creative",
  "Other",
];

export function UploadZone({ usage }: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("Tech");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentUsage, setCurrentUsage] = useState<any>(usage);
  const router = useRouter();

  // Listen for quota updates from QuotaMeter
  useEffect(() => {
    const handleUpdate = (e: any) => {
      setCurrentUsage(e.detail);
    };
    window.addEventListener('quota-updated', handleUpdate);
    return () => window.removeEventListener('quota-updated', handleUpdate);
  }, []);

  const isLocked = (currentUsage?.roasts_remaining ?? currentUsage?.remaining ?? (usage?.roasts_remaining ?? (usage as any)?.remaining ?? 1)) <= 0;
  const isFree = (currentUsage?.plan === "free") || (usage?.plan === "free");

  // Rotate loading messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading) {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isUploading]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (isLocked) return;
    const selectedFile = acceptedFiles[0];
    const isValidType = selectedFile && (
      selectedFile.type === "application/pdf" || 
      selectedFile.type.startsWith("image/")
    );
    
    if (isValidType) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a PDF or Image file (JPG/PNG).");
    }
  }, [isLocked]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    multiple: false,
    disabled: isLocked || isUploading,
  });

  const handleUpload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!file || isLocked) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Extract text from PDF
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Failed to read PDF");

      // 2. Generate the roast
      const roastRes = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: uploadData.text,
          fileName: file.name,
          role: role,
          industry: industry,
        }),
      });

      const roastData = await roastRes.json();
      if (!roastRes.ok) {
        throw new Error(roastData.error || "Failed to generate roast. Please try again.");
      }

      // 3. Success - Save to session/local storage as fallback and redirect
      if (typeof window !== "undefined") {
        const roastJson = JSON.stringify(roastData.roast);
        sessionStorage.setItem("latest_roast", roastJson);
        localStorage.setItem("latest_roast", roastJson); // More persistent fallback
        
        // Also add to local history for persistent view if DB is missing
        const localHistory = JSON.parse(localStorage.getItem("roast_history") || "[]");
        const newEntry = {
          id: roastData.id || `local-${Date.now()}`,
          resume_name: file.name || "resume.pdf",
          score: roastData.roast.score,
          roast_json: roastData.roast,
          created_at: new Date().toISOString()
        };
        localStorage.setItem("roast_history", JSON.stringify([newEntry, ...localHistory].slice(0, 50)));
      }
      
      router.refresh();
      const targetId = roastData.id || "latest";
      router.push(`/dashboard/roast/${targetId}`);
    } catch (err) {
      console.error("Upload/Roast Error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsUploading(false);
    }
  };

  if (isLocked && isFree) {
    return (
      <div className="relative overflow-hidden rounded-[24px] border border-red-500/20 bg-red-500/5 p-6 sm:p-12 text-center backdrop-blur-md">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <div className="rounded-2xl bg-red-500/20 p-5 text-red-500 shadow-2xl shadow-red-500/20 mb-6">
            <Lock className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
            You have used your {currentUsage?.quota || usage?.quota_limit || 2} free reports this month
          </h3>
          <p className="text-sm font-medium text-gray-400 max-w-sm mb-8">
            Upgrade to Pro for 30 roasts per month, advanced career fixes, and unlimited history.
          </p>
          <button 
            onClick={() => router.push("/pricing")}
            className="rounded-xl bg-white px-8 py-4 text-sm font-black text-black hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
          >
            Upgrade for unlimited access →
          </button>
        </div>
        
        {/* Blurred background version of the upload zone for aesthetics */}
        <div className="opacity-10 pointer-events-none filter blur-sm">
           <Upload className="h-12 w-12 mx-auto mb-4" />
           <p className="text-lg font-bold">Drag & drop your resume</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isUploading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-6"
          >
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
              <Flame className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-red-500" />
            </div>
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg font-bold text-white tracking-tight text-center"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }}
              className="mt-2 px-6 py-4 bg-purple-500/10 border border-purple-500/20 rounded-xl max-w-sm text-center shadow-lg shadow-purple-500/5"
            >
              <p className="text-sm font-medium text-gray-300 leading-relaxed">
                <span className="font-black text-purple-400 block mb-1">Quality takes time. ⏳</span> 
                Your high-accuracy Roast Report will be ready in <span className="text-white font-bold">~1.5 minutes</span>. Feel free to grab a coffee!
              </p>
            </motion.div>
          </motion.div>
        ) : !file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            {...(getRootProps() as any)}
            className={`group relative cursor-pointer overflow-hidden rounded-[20px] border-2 border-dashed p-6 sm:p-12 text-center transition-all duration-300 ${
              isDragActive 
                ? "border-purple-500 bg-purple-500/5" 
                : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className={`rounded-2xl p-4 transition-transform duration-300 group-hover:scale-110 ${
                isDragActive ? "bg-purple-500 text-white" : "bg-white/5 text-gray-400"
              }`}>
                <Upload className="h-8 w-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">
                  Drag & drop your resume or click to browse
                </p>
                <p className="mt-2 text-xs text-gray-500 uppercase tracking-widest font-bold">PDF, JPG, PNG · Max 10MB</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[20px] border border-white/10 bg-white/[0.02] p-8"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="truncate font-bold text-white">{file.name}</p>
                  <p className="text-xs text-gray-500 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest"
              >
                Change file
              </button>
            </div>

            <div className="mt-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Target Job Role</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Product Manager at Google"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Industry</label>
                <div className="relative">
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-5 py-4 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm font-medium text-red-400 border border-red-500/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!role.trim()}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-red-600 h-16 text-lg font-black text-white transition-all hover:scale-[1.02] active:scale-98 shadow-[0_0_30px_rgba(168,85,247,0.2)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Roast This Resume 🔥
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
