import { db } from "@/lib/db/client";
import { templates, templateVersions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import type { Template, TemplateVersion, TemplateSchema, TemplateTheme } from "@/types";

/**
 * Get all active templates with their current version.
 */
export async function getActiveTemplates() {
  const result = await db
    .select({
      id: templates.id,
      slug: templates.slug,
      name: templates.name,
      category: templates.category,
      thumbnailUrl: templates.thumbnailUrl,
      previewUrl: templates.previewUrl,
      rendererKey: templates.rendererKey,
      pricingTier: templates.pricingTier,
      priceAmount: templates.priceAmount,
      originalPrice: templates.originalPrice,
      versionId: templateVersions.id,
      version: templateVersions.version,
      schema: templateVersions.schema,
      theme: templateVersions.theme,
    })
    .from(templates)
    .innerJoin(
      templateVersions,
      and(
        eq(templateVersions.templateId, templates.id),
        eq(templateVersions.isCurrent, true)
      )
    )
    .where(eq(templates.active, true));

  return result;
}

/**
 * Get a single template by slug with its current version.
 */
export async function getTemplateBySlug(slug: string) {
  const result = await db
    .select({
      id: templates.id,
      slug: templates.slug,
      name: templates.name,
      category: templates.category,
      thumbnailUrl: templates.thumbnailUrl,
      previewUrl: templates.previewUrl,
      rendererKey: templates.rendererKey,
      pricingTier: templates.pricingTier,
      priceAmount: templates.priceAmount,
      originalPrice: templates.originalPrice,
      versionId: templateVersions.id,
      version: templateVersions.version,
      schema: templateVersions.schema,
      theme: templateVersions.theme,
    })
    .from(templates)
    .innerJoin(
      templateVersions,
      and(
        eq(templateVersions.templateId, templates.id),
        eq(templateVersions.isCurrent, true)
      )
    )
    .where(and(eq(templates.slug, slug), eq(templates.active, true)))
    .limit(1);

  return result[0] || null;
}

/**
 * Get template by ID.
 */
export async function getTemplateById(id: string) {
  const result = await db
    .select()
    .from(templates)
    .where(eq(templates.id, id))
    .limit(1);

  return result[0] || null;
}

/**
 * Get the current version for a template.
 */
export async function getCurrentVersion(
  templateId: string
): Promise<TemplateVersion | null> {
  const result = await db
    .select()
    .from(templateVersions)
    .where(
      and(
        eq(templateVersions.templateId, templateId),
        eq(templateVersions.isCurrent, true)
      )
    )
    .limit(1);

  return result[0] || null;
}

/**
 * Parse and validate template schema from JSONB.
 */
export function parseSchema(schemaJson: unknown): TemplateSchema {
  return schemaJson as TemplateSchema;
}

/**
 * Parse and validate template theme from JSONB.
 */
export function parseTheme(themeJson: unknown): TemplateTheme {
  return themeJson as TemplateTheme;
}
