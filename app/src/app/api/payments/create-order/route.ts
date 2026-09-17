import { NextRequest } from "next/server";
import {
  apiSuccess,
  apiError,
  parseBody,
  requireAuth,
  checkRateLimit,
} from "@/lib/api-helpers";
import { createOrderSchema } from "@/lib/validators";
import { db } from "@/lib/db/client";
import { payments } from "@/lib/db/schema";
import { getProject, updateProjectStatus } from "@/lib/services/project.service";

/**
 * POST /api/payments/create-order — Activate project for free (Limited-Time Offer, No Payment Required).
 */
export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 10, 60000);
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

  // All services are 100% FREE as a limited time offer
  const orderId = `free_${Date.now()}_${project.id.slice(0, 8)}`;

  try {
    // Record free promotion payment in DB
    await db
      .insert(payments)
      .values({
        projectId: project.id,
        userId: auth.user.sub,
        provider: "free_offer",
        providerOrderId: orderId,
        amount: "0.00",
        currency: "INR",
        status: "success",
        verifiedAt: new Date(),
      })
      .onConflictDoNothing();

    // Mark project as live immediately
    await updateProjectStatus(project.id, "live");

    return apiSuccess({
      isFree: true,
      status: "success",
      orderId,
      projectId: project.id,
      slug: project.slug,
      message: "Limited time offer claimed! Your birthday website is now live.",
    });
  } catch (error) {
    console.error("Free order activation error:", error);
    // Even if payment insert had conflict, ensure project is live
    await updateProjectStatus(project.id, "live");
    return apiSuccess({
      isFree: true,
      status: "success",
      orderId,
      projectId: project.id,
      slug: project.slug,
    });
  }
}
