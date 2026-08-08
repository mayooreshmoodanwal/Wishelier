import { NextRequest } from "next/server";
import {
  apiSuccess,
  apiError,
  parseBody,
  requireAuth,
  checkRateLimit,
} from "@/lib/api-helpers";
import { createOrderSchema } from "@/lib/validators";
import {
  createPaymentOrder,
  verifyWebhookSignature,
  processWebhookEvent,
  getPaymentStatus,
} from "@/lib/payments/cashfree";
import { getProject } from "@/lib/services/project.service";
import { getTemplateById } from "@/lib/services/template.service";

/**
 * POST /api/payments/create-order — Create a Cashfree payment order.
 */
export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 5, 60000);
  if (rateLimited) return rateLimited;

  const auth = await requireAuth(request);
  if ("error" in auth) return auth.error;

  const parsed = await parseBody(request, createOrderSchema);
  if ("error" in parsed) return parsed.error;

  // Verify project ownership
  const project = await getProject(parsed.data.projectId, auth.user.sub);
  if (!project) {
    return apiError("NOT_FOUND", "Project not found", 404);
  }

  if (project.status !== "draft") {
    return apiError("INVALID_STATUS", "Project must be in draft status to pay", 400);
  }

  // Get template price
  const template = await getTemplateById(project.templateId);
  if (!template) {
    return apiError("NOT_FOUND", "Template not found", 404);
  }

  const result = await createPaymentOrder(
    project.id,
    auth.user.sub,
    template.priceAmount,
    auth.user.email,
    (project.data as Record<string, unknown>)?.birthdayPerson as string || "Birthday Person"
  );

  if (!result.success) {
    return apiError("PAYMENT_FAILED", result.error!, 500);
  }

  return apiSuccess({
    paymentSessionId: result.paymentSessionId,
    orderId: result.orderId,
  });
}
