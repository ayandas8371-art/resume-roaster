"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";

interface ShowProps {
  when: "signed-in" | "signed-out";
  children: React.ReactNode;
}

/**
 * A modern replacement for SignedIn and SignedOut as requested.
 * Uses useUser hook to determine authentication state.
 */
export function Show({ when, children }: ShowProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (when === "signed-in" && isSignedIn) {
    return <>{children}</>;
  }

  if (when === "signed-out" && !isSignedIn) {
    return <>{children}</>;
  }

  return null;
}
