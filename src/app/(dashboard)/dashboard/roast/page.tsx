"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoastRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if there is a latest roast in session storage
    const latest = sessionStorage.getItem("latest_roast");
    if (latest) {
      router.replace("/dashboard/roast/latest");
    } else {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
    </div>
  );
}
