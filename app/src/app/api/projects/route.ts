import { NextRequest } from "next/server";
import {
  apiSuccess,
  apiError,
  parseBody,
  requireAuth,
  checkRateLimit,
} from "@/lib/api-helpers";
import { createProjectSchema } from "@/lib/validators";
import {
  createProject,
  getUserProjects,
} from "@/lib/services/project.service";

/**
 * GET /api/projects — List all projects for the authenticated user.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if ("error" in auth) return auth.error;

  try {
    const projects = await getUserProjects(auth.user.sub);
    return apiSuccess(projects);
  } catch (error) {
    console.error("Projects list error:", error);
    return apiError("INTERNAL_ERROR", "Failed to fetch projects", 500);
  }
}

/**
 * POST /api/projects — Create a new project (draft).
 */
export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 10, 60000);
  if (rateLimited) return rateLimited;

  const auth = await requireAuth(request);
  if ("error" in auth) return auth.error;

  const parsed = await parseBody(request, createProjectSchema);
  if ("error" in parsed) return parsed.error;

  const result = await createProject(
    auth.user.sub,
    parsed.data.templateSlug,
    parsed.data.data,
    parsed.data.customSlug
  );

  if (!result.success) {
    return apiError("CREATE_FAILED", result.error!, 400);
  }

  return apiSuccess(result.project, 201);
}
