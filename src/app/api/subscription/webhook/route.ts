import { NextRequest, NextResponse } from "next/server";
import {
  handleWebhookEvent,
  verifyWebhookSignature,
} from "@/lib/revenuecat";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature =
      request.headers.get("authorization")?.replace("Bearer ", "") || "";

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    await handleWebhookEvent(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
