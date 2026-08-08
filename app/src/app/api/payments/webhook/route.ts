import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  processWebhookEvent,
} from "@/lib/payments/cashfree";

/**
 * POST /api/payments/webhook — Cashfree webhook handler.
 * 
 * CRITICAL SECURITY:
 * - Signature-verified (HMAC-SHA256)
 * - Idempotent on provider_event_id
 * - This is the ONLY code path that can mark payment as success
 * - No auth required (called by Cashfree servers)
 */
export async function POST(request: NextRequest) {
  try {
    // Read raw body for signature verification
    const rawBody = await request.text();
    const timestamp = request.headers.get("x-webhook-timestamp") || "";
    const signature = request.headers.get("x-webhook-signature") || "";

    // Verify signature
    if (!signature || !timestamp) {
      console.warn("Webhook missing signature/timestamp headers");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    const isValid = verifyWebhookSignature(rawBody, timestamp, signature);
    if (!isValid) {
      console.warn("Webhook signature verification failed");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse the verified payload
    const payload = JSON.parse(rawBody);

    // Process the event
    const result = await processWebhookEvent(payload);
    if (!result.success) {
      console.error("Webhook processing error:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log(`Webhook processed: ${result.action} for event`);

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true, action: result.action });
  } catch (error) {
    console.error("Webhook handler error:", error);
    // Return 200 anyway to prevent Cashfree from retrying
    // (we log the error for debugging)
    return NextResponse.json({ received: true, error: "Internal processing error" });
  }
}
