import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // RevenueCat Web SDK handles the purchase flow client-side
    // This endpoint is for initializing any server-side state if needed
    return NextResponse.json({
      customerId: userId,
      message: "Use RevenueCat Web SDK to initiate purchase flow",
    });
  } catch (error) {
    console.error("Subscription create error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
