"use client";

import { Plan } from "@/types";
import { useRevenueCat } from "./providers/revenuecat-provider";
import { useEffect } from "react";

interface UpgradeModalProps {
  isOpen: boolean;
  currentPlan: Plan;
  onClose: () => void;
  onSelect?: (plan: Plan) => void;
}

/**
 * UpgradeModal — delegates to RevenueCatProvider's showPaywall()
 * which opens the real RevenueCat checkout overlay.
 */
export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { showPaywall, isInitialized, isLoading } = useRevenueCat();

  useEffect(() => {
    if (isOpen && isInitialized && !isLoading) {
      onClose();
      showPaywall();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isInitialized, isLoading]);

  return null;
}
