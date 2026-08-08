import crypto from "crypto";
import { db } from "@/lib/db/client";
import { payments, projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { updateProjectStatus } from "@/lib/services/project.service";

const CASHFREE_BASE_URL =
  process.env.CASHFREE_ENVIRONMENT === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_APP_SECRET = process.env.CASHFREE_APP_SECRET!;

/**
 * Create a Cashfree payment order.
 */
export async function createPaymentOrder(
  projectId: string,
  userId: string,
  amount: string,
  customerEmail: string,
  customerName: string,
  customerPhone?: string
): Promise<{
  success: boolean;
  paymentSessionId?: string;
  orderId?: string;
  error?: string;
}> {
  const orderId = `wish_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  const validPhone = (customerPhone && customerPhone.replace(/\D/g, "").slice(-10)) || "9999999999";

  try {
    const response = await fetch(`${CASHFREE_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_APP_SECRET,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: parseFloat(amount),
        order_currency: "INR",
        customer_details: {
          customer_id: userId,
          customer_email: customerEmail,
          customer_name: customerName,
          customer_phone: validPhone.length === 10 ? validPhone : "9999999999",
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${projectId}?order_id=${orderId}`,
          notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
        },
        order_note: `Wishelier birthday site - ${projectId}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree order creation failed:", data);
      return { success: false, error: data.message || "Payment order failed" };
    }

    // Store payment record
    await db.insert(payments).values({
      projectId,
      userId,
      provider: "cashfree",
      providerOrderId: orderId,
      amount,
      currency: "INR",
      status: "created",
    });

    // Update project status
    await updateProjectStatus(projectId, "pending_payment");

    return {
      success: true,
      paymentSessionId: data.payment_session_id,
      orderId,
    };
  } catch (error) {
    console.error("Cashfree order error:", error);
    return { success: false, error: "Failed to create payment order" };
  }
}

/**
 * Verify Cashfree webhook signature (HMAC-SHA256).
 */
export function verifyWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string
): boolean {
  const message = timestamp + rawBody;
  const expectedSignature = crypto
    .createHmac("sha256", CASHFREE_APP_SECRET)
    .update(message)
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Process a verified webhook event.
 * CRITICAL: This is the ONLY function that can mark a payment as successful.
 */
export async function processWebhookEvent(
  payload: Record<string, unknown>
): Promise<{ success: boolean; action?: string; error?: string }> {
  const eventData = payload.data as Record<string, unknown>;
  const order = eventData?.order as Record<string, unknown>;
  const payment = eventData?.payment as Record<string, unknown>;

  if (!order?.order_id) {
    return { success: false, error: "Invalid webhook payload" };
  }

  const orderId = order.order_id as string;
  const eventId = (payload.event_id || payload.data?.toString()) as string;
  const orderStatus = (order.order_status as string)?.toUpperCase();

  // Idempotency check: skip if we've already processed this event
  if (eventId) {
    const [existing] = await db
      .select({ id: payments.id })
      .from(payments)
      .where(eq(payments.providerEventId, eventId))
      .limit(1);

    if (existing) {
      return { success: true, action: "already_processed" };
    }
  }

  // Find the payment record
  const [paymentRecord] = await db
    .select()
    .from(payments)
    .where(eq(payments.providerOrderId, orderId))
    .limit(1);

  if (!paymentRecord) {
    return { success: false, error: "Payment record not found for order" };
  }

  if (orderStatus === "PAID") {
    // Update payment status
    await db
      .update(payments)
      .set({
        status: "success",
        providerEventId: eventId,
        rawWebhookPayload: payload,
        verifiedAt: new Date(),
      })
      .where(eq(payments.id, paymentRecord.id));

    // Update project status to "paid" and trigger generation
    await updateProjectStatus(paymentRecord.projectId, "paid");

    // TODO: Enqueue generation job here
    // For now, immediately mark as generating
    await updateProjectStatus(paymentRecord.projectId, "generating");

    return { success: true, action: "payment_confirmed" };
  } else if (orderStatus === "EXPIRED" || orderStatus === "CANCELLED") {
    await db
      .update(payments)
      .set({
        status: "failed",
        providerEventId: eventId,
        rawWebhookPayload: payload,
      })
      .where(eq(payments.id, paymentRecord.id));

    await updateProjectStatus(paymentRecord.projectId, "draft");

    return { success: true, action: "payment_failed" };
  }

  return { success: true, action: "no_action" };
}

/**
 * Get payment status for a project with real-time Cashfree API fallback verification.
 */
export async function getPaymentStatus(
  projectId: string,
  userId: string,
  optionalOrderId?: string
): Promise<{ status: string; orderId?: string } | null> {
  // 1. Verify project ownership
  const [project] = await db
    .select({ userId: projects.userId, status: projects.status })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project || project.userId !== userId) return null;

  // 2. Fetch payment record from DB
  const [paymentRecord] = await db
    .select()
    .from(payments)
    .where(eq(payments.projectId, projectId))
    .limit(1);

  if (!paymentRecord) return null;

  // If already marked as success in DB, return immediately
  if (paymentRecord.status === "success") {
    return { status: "success", orderId: paymentRecord.providerOrderId };
  }

  // 3. Direct Cashfree API Verification (Real-Time Fallback)
  const targetOrderId = optionalOrderId || paymentRecord.providerOrderId;
  if (targetOrderId) {
    try {
      const response = await fetch(`${CASHFREE_BASE_URL}/orders/${targetOrderId}`, {
        method: "GET",
        headers: {
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_APP_SECRET,
          "x-api-version": "2023-08-01",
        },
      });

      if (response.ok) {
        const orderData = await response.json();
        const cfStatus = (orderData.order_status as string)?.toUpperCase();

        if (cfStatus === "PAID") {
          // Update payment status to success
          await db
            .update(payments)
            .set({
              status: "success",
              verifiedAt: new Date(),
              rawWebhookPayload: orderData,
            })
            .where(eq(payments.id, paymentRecord.id));

          // Mark project as live
          await updateProjectStatus(projectId, "live");

          return { status: "success", orderId: targetOrderId };
        } else if (cfStatus === "EXPIRED" || cfStatus === "CANCELLED") {
          await db
            .update(payments)
            .set({ status: "failed", rawWebhookPayload: orderData })
            .where(eq(payments.id, paymentRecord.id));

          await updateProjectStatus(projectId, "draft");

          return { status: "failed", orderId: targetOrderId };
        }
      }
    } catch (err) {
      console.error("Direct Cashfree API order check failed:", err);
    }
  }

  return { status: paymentRecord.status, orderId: paymentRecord.providerOrderId };
}
