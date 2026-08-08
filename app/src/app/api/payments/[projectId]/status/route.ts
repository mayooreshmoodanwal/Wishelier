import { NextRequest } from "next/server";
import { apiSuccess, apiError, requireAuth } from "@/lib/api-helpers";
import { getPaymentStatus } from "@/lib/payments/cashfree";

/**
 * GET /api/payments/[projectId]/status — Poll payment status.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const auth = await requireAuth(request);
  if ("error" in auth) return auth.error;

  const { projectId } = await params;
  const orderId = request.nextUrl.searchParams.get("order_id") || undefined;
  const status = await getPaymentStatus(projectId, auth.user.sub, orderId);

  if (!status) {
    return apiError("NOT_FOUND", "Payment not found", 404);
  }

  return apiSuccess(status);
}
