"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ChevronLeft, Download, Share2, AlertTriangle, Printer } from "lucide-react";
import { RoastCard } from "@/components/roast-card";
import type { RoastResult } from "@/types";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export default function RoastResultPage() {
  const params = useParams();
  const router = useRouter();
  const [roastData, setRoastData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTemporary, setIsTemporary] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchRoast() {
      try {
        setIsLoading(true);
        // Special case for 'latest' or when no ID is provided
        if (params.id === "latest") {
          const stored = sessionStorage.getItem("latest_roast") || localStorage.getItem("latest_roast");
          if (stored) {
            setRoastData({ roast_json: JSON.parse(stored) });
            setIsTemporary(true);
            setIsLoading(false);
            return;
          }
        }

        // Standard ID fetch
        const res = await fetch(`/api/roast/${params.id}`);
        if (!res.ok) {
          // Check session/local storage as fallback
          const storedSession = sessionStorage.getItem("latest_roast");
          const storedHistory = localStorage.getItem("roast_history");
          
          if (storedSession) {
             setRoastData({ roast_json: JSON.parse(storedSession) });
             setIsTemporary(true);
             setIsLoading(false);
             return;
          }

          if (storedHistory) {
             const history = JSON.parse(storedHistory);
             const found = history.find((r: any) => r.id === params.id);
             if (found) {
               setRoastData({ roast_json: found.roast_json });
               setIsTemporary(true);
               setIsLoading(false);
               return;
             }
          }
          throw new Error("Roast not found");
        }
        const data = await res.json();
        setRoastData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load roast");
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) fetchRoast();
  }, [params.id]);

  const handleExportPDF = async () => {
    if (!resultRef.current) return;
    try {
      setIsExporting(true);
      // Wait slightly to ensure fonts are fully ready
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const element = resultRef.current;
      
      // Use native browser rendering to capture the flawless layout
      const dataUrl = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
      });
      
      const width = element.offsetWidth * 2;
      const height = element.offsetHeight * 2;
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [width, height]
      });
      
      pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
      pdf.save(`resume-roast-${roastData?.id || "latest"}.pdf`);
    } catch (err) {
      console.error("PDF Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <p className="text-gray-400 font-medium">Retrieving your roast...</p>
      </div>
    );
  }

  if (error || !roastData) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-red-500/10 p-4 text-red-500">
          <ChevronLeft className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Roast not found</h2>
        <p className="text-gray-400">{error}</p>
        <button onClick={() => router.push("/dashboard")} className="mt-4 rounded-xl bg-white/5 px-6 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors">Go Back</button>
      </div>
    );
  }

  const result = roastData.roast_json as RoastResult;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shadow-lg shadow-emerald-500/5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.1em]">SAVED TO HISTORY</span>
          </div>
          
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-xs font-black text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
            SAVE PDF
          </button>
          
          <button 
            onClick={() => {
              const event = new CustomEvent('open-share-modal');
              window.dispatchEvent(event);
            }}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-black text-white hover:bg-purple-500 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-purple-600/20"
          >
            <Share2 className="h-4 w-4" />
            SHARE ROAST
          </button>
        </div>
      </div>

      <div ref={resultRef} className="p-1 sm:p-4 rounded-[2.5rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RoastCard roast={result} />
        </motion.div>
      </div>
    </div>
  );
}
