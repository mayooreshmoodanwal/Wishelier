import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { getActiveTemplates, getTemplateBySlug } from "@/lib/services/template.service";

/**
 * GET /api/templates — List all active templates with their current schema + theme.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const slug = searchParams.get("slug");

    if (slug) {
      // Get single template by slug
      const template = await getTemplateBySlug(slug);
      if (!template) {
        return apiError("NOT_FOUND", "Template not found", 404);
      }
      return apiSuccess(template);
    }

    // List all active templates
    const templates = await getActiveTemplates();
    return apiSuccess(templates);
  } catch (error) {
    console.error("Templates API error:", error);
    return apiError("INTERNAL_ERROR", "Failed to fetch templates", 500);
  }
}
