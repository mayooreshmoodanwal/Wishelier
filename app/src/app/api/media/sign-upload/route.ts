import { NextRequest } from "next/server";
import { apiSuccess, apiError, requireAuth, checkRateLimit } from "@/lib/api-helpers";
import { getUploadAuthParams } from "@/lib/storage/imagekit";
import { db } from "@/lib/db/client";
import { media, projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * POST /api/media/sign-upload — Get signed upload auth params for client-side direct upload.
 */
export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 30, 60000);
  if (rateLimited) return rateLimited;

  const auth = await requireAuth(request);
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const { projectId, fieldKey, contentType } = body;

    if (!projectId || !fieldKey || !contentType) {
      return apiError(
        "VALIDATION_ERROR",
        "projectId, fieldKey, and contentType are required",
        422
      );
    }

    // Verify project ownership
    const [project] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(
        and(eq(projects.id, projectId), eq(projects.userId, auth.user.sub))
      )
      .limit(1);

    if (!project) {
      return apiError("NOT_FOUND", "Project not found", 404);
    }

    // Generate ImageKit auth params for client-side upload
    const authParams = getUploadAuthParams();

    return apiSuccess({
      ...authParams,
      folder: `/wishelier/projects/${projectId}/${fieldKey}`,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  } catch (error) {
    console.error("Sign upload error:", error);
    return apiError("INTERNAL_ERROR", "Failed to generate upload credentials", 500);
  }
}
