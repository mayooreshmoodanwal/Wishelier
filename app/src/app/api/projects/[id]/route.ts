import { NextRequest } from "next/server";
import { apiSuccess, apiError, parseBody, requireAuth } from "@/lib/api-helpers";
import { updateProjectSchema } from "@/lib/validators";
import { getProject, updateProject } from "@/lib/services/project.service";

/**
 * GET /api/projects/[id] — Get a single project.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const project = await getProject(id, auth.user.sub);

  if (!project) {
    return apiError("NOT_FOUND", "Project not found", 404);
  }

  return apiSuccess(project);
}

/**
 * PATCH /api/projects/[id] — Update project data.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const parsed = await parseBody(request, updateProjectSchema);
  if ("error" in parsed) return parsed.error;

  const result = await updateProject(id, auth.user.sub, parsed.data.data);
  if (!result.success) {
    return apiError("UPDATE_FAILED", result.error!, 400);
  }

  return apiSuccess({ message: "Project updated" });
}
