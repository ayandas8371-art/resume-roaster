import React from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

interface ShowProps {
  when: "signed-in" | "signed-out";
  children: React.ReactNode;
}

/**
 * A modern replacement for SignedIn and SignedOut as requested.
 * Updated to use Clerk's native SSR-compatible components to prevent UI flickering.
 */
export function Show({ when, children }: ShowProps) {
  if (when === "signed-in") {
    return <SignedIn>{children}</SignedIn>;
  }

  if (when === "signed-out") {
    return <SignedOut>{children}</SignedOut>;
  }

  return null;
}
