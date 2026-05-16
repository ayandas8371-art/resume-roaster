"use client";

import { useState, useEffect, useCallback } from "react";
import type { Roast } from "@/types";

interface HistoryData {
  roasts: Roast[];
  total: number;
  page: number;
  hasMore: boolean;
}

export function useHistory(initialPage = 1, limit = 10) {
  const [data, setData] = useState<HistoryData>({
    roasts: [],
    total: 0,
    page: initialPage,
    hasMore: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);
        
        // 1. Fetch from API
        const response = await fetch(
          `/api/history?page=${page}&limit=${limit}`
        );
        
        let apiRoasts: Roast[] = [];
        let apiTotal = 0;
        let apiHasMore = false;

        if (response.ok) {
          const result = await response.json();
          apiRoasts = result.roasts || [];
          apiTotal = result.total || 0;
          apiHasMore = result.hasMore || false;
        }

        // 2. Load from Local Storage (Fallback/Merge)
        let localRoasts: Roast[] = [];
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("roast_history");
          if (stored) {
            try {
              localRoasts = JSON.parse(stored);
            } catch (e) {
              console.error("Failed to parse local history", e);
            }
          }
        }

        // 3. Merge and De-duplicate by ID
        // Priority to API roasts if IDs match
        const mergedMap = new Map<string, Roast>();
        
        // Add local first
        localRoasts.forEach(r => mergedMap.set(r.id, r));
        // Overwrite with API (more authoritative)
        apiRoasts.forEach(r => mergedMap.set(r.id, r));

        const allRoasts = Array.from(mergedMap.values())
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setData({
          roasts: allRoasts,
          total: Math.max(apiTotal, allRoasts.length),
          page: page,
          hasMore: apiHasMore,
        });
        
        setError(null);
      } catch (err) {
        // Even if API fails, try to show local history
        if (typeof window !== "undefined") {
           const stored = localStorage.getItem("roast_history");
           if (stored) {
             const local = JSON.parse(stored);
             setData(prev => ({
               ...prev,
               roasts: local,
               total: local.length,
               hasMore: false
             }));
           }
        }
        setError(err instanceof Error ? err.message : "Failed to fetch history");
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchHistory(initialPage);
  }, [fetchHistory, initialPage]);

  const nextPage = () => {
    if (data.hasMore) {
      fetchHistory(data.page + 1);
    }
  };

  const prevPage = () => {
    if (data.page > 1) {
      fetchHistory(data.page - 1);
    }
  };

  return { ...data, isLoading, error, nextPage, prevPage, refetch: () => fetchHistory(data.page) };
}
