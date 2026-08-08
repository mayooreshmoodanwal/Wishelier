import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { isSlugAvailable } from "@/lib/services/project.service";

/**
 * GET /api/slugs/check?value=my-slug — Check if a slug is available (public endpoint).
 */
export async function GET(request: NextRequest) {
  const value = request.nextUrl.searchParams.get("value");
  if (!value || value.length < 3 || value.length > 32) {
    return apiError(
      "VALIDATION_ERROR",
      "Slug must be 3-32 characters",
      422
    );
  }

  if (!/^[a-z0-9-]+$/.test(value)) {
    return apiError(
      "VALIDATION_ERROR",
      "Slug must be lowercase alphanumeric with hyphens",
      422
    );
  }

  const result = await isSlugAvailable(value);
  return apiSuccess(result);
}
