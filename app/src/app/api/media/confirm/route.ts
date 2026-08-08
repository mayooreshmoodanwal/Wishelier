import { NextRequest } from "next/server";
import { apiSuccess, apiError, parseBody, requireAuth } from "@/lib/api-helpers";
import { confirmUploadSchema } from "@/lib/validators";
import { db } from "@/lib/db/client";
import { media, projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { validateContentType } from "@/lib/storage/imagekit";

/**
 * POST /api/media/confirm — Confirm an uploaded file and create media record.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if ("error" in auth) return auth.error;

  const parsed = await parseBody(request, confirmUploadSchema);
  if ("error" in parsed) return parsed.error;

  const { projectId, fieldKey, url, type, width, height, durationSeconds, sizeBytes } =
    parsed.data;

  // Verify project ownership
  const [project] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, auth.user.sub)))
    .limit(1);

  if (!project) {
    return apiError("NOT_FOUND", "Project not found", 404);
  }

  // Create media record
  const [mediaRecord] = await db
    .insert(media)
    .values({
      projectId,
      fieldKey,
      provider: "imagekit",
      url,
      type,
      width,
      height,
      durationSeconds: durationSeconds?.toString(),
      sizeBytes,
    })
    .returning();

  return apiSuccess(mediaRecord, 201);
}
