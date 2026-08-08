import { db } from "@/lib/db/client";
import { projects, templates, templateVersions } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import slugify from "slug";

const RESERVED_SLUGS = [
  "admin",
  "api",
  "app",
  "dashboard",
  "login",
  "signup",
  "create",
  "checkout",
  "share",
  "s",
  "settings",
  "account",
  "help",
  "support",
  "terms",
  "privacy",
  "about",
  "blog",
  "status",
  "pricing",
  "wishelier",
];

/**
 * Generate a unique slug for a project.
 */
export async function generateSlug(
  birthdayPerson: string,
  customSlug?: string
): Promise<string> {
  if (customSlug) {
    const normalized = slugify(customSlug, { lower: true });
    if (RESERVED_SLUGS.includes(normalized)) {
      throw new Error("This slug is reserved. Please choose another.");
    }

    // Check if already taken
    const existing = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.slug, normalized))
      .limit(1);

    if (existing.length > 0) {
      throw new Error("This slug is already taken. Please choose another.");
    }

    return normalized;
  }

  // Auto-generate: name + random suffix
  const base = slugify(birthdayPerson || "birthday", { lower: true });
  const suffix = nanoid(6).toLowerCase();
  const generated = `${base}-${suffix}`;

  return generated;
}

/**
 * Create a new project (draft).
 */
export async function createProject(
  userId: string,
  templateSlug: string,
  data: Record<string, unknown>,
  customSlug?: string
): Promise<{
  success: boolean;
  project?: { id: string; slug: string };
  error?: string;
}> {
  // Look up template
  const [template] = await db
    .select({
      id: templates.id,
      versionId: templateVersions.id,
    })
    .from(templates)
    .innerJoin(
      templateVersions,
      and(
        eq(templateVersions.templateId, templates.id),
        eq(templateVersions.isCurrent, true)
      )
    )
    .where(and(eq(templates.slug, templateSlug), eq(templates.active, true)))
    .limit(1);

  if (!template) {
    return { success: false, error: "Template not found or inactive" };
  }

  try {
    const slug = await generateSlug(
      (data.birthdayPerson as string) || "",
      customSlug
    );

    const [project] = await db
      .insert(projects)
      .values({
        userId,
        templateId: template.id,
        templateVersionId: template.versionId,
        slug,
        status: "draft",
        data,
      })
      .returning({ id: projects.id, slug: projects.slug });

    return { success: true, project };
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }
    throw err;
  }
}

/**
 * Get a project by ID (with auth check).
 */
export async function getProject(projectId: string, userId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .limit(1);

  return project || null;
}

/**
 * Get all projects for a user.
 */
export async function getUserProjects(userId: string) {
  return db
    .select({
      id: projects.id,
      slug: projects.slug,
      status: projects.status,
      data: projects.data,
      templateId: projects.templateId,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      expiresAt: projects.expiresAt,
      templateName: templates.name,
      templateSlug: templates.slug,
      templateCategory: templates.category,
    })
    .from(projects)
    .innerJoin(templates, eq(templates.id, projects.templateId))
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.createdAt));
}

/**
 * Update project data.
 */
export async function updateProject(
  projectId: string,
  userId: string,
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  const project = await getProject(projectId, userId);
  if (!project) {
    return { success: false, error: "Project not found" };
  }

  if (!["draft", "live"].includes(project.status)) {
    return {
      success: false,
      error: "Project can only be edited in draft or live status",
    };
  }

  await db
    .update(projects)
    .set({ data, updatedAt: new Date() })
    .where(eq(projects.id, projectId));

  return { success: true };
}

/**
 * Update project status.
 */
export async function updateProjectStatus(
  projectId: string,
  status: "draft" | "pending_payment" | "paid" | "generating" | "live" | "failed" | "expired"
): Promise<void> {
  const updateData: Record<string, unknown> = {
    status,
    updatedAt: new Date(),
  };

  // Set expiry when going live (1 year)
  if (status === "live") {
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    updateData.expiresAt = expiresAt;
  }

  await db.update(projects).set(updateData).where(eq(projects.id, projectId));
}

/**
 * Check if a slug is available.
 */
export async function isSlugAvailable(
  slug: string
): Promise<{ available: boolean; reason?: string }> {
  if (RESERVED_SLUGS.includes(slug)) {
    return { available: false, reason: "This slug is reserved" };
  }

  const existing = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    return { available: false, reason: "This slug is already taken" };
  }

  return { available: true };
}
