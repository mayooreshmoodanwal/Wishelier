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

// Default starter content for each template to ensure generated websites are always complete
const TEMPLATE_DEFAULTS: Record<string, Record<string, unknown>> = {
  "starlit-celebration": {
    birthdayPerson: "Sarah",
    heroPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
    specialMessage:
      "Dear Sarah,\n\nOn this beautiful day, I want you to know how incredibly special you are. Your smile lights up every room, your kindness touches every heart, and your spirit inspires everyone around you.\n\nMay this new year of your life bring you endless joy, boundless love, and all the dreams your heart desires. You deserve every bit of happiness the world has to offer.\n\nHere's to another year of adventures, laughter, and beautiful memories together!",
    senderSignature: "With all my love ❤️",
    gallery: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop",
    ],
    galleryCaptions: [
      "Beautiful Smile",
      "Golden Hour",
      "Pure Joy",
      "Best Day Ever",
      "Always Shining",
      "Forever Young",
    ],
    wishes: [
      "May your life be as colorful and vibrant as a rainbow after the rain.",
      "Wishing you success in everything you touch this year and always.",
      "May you spread your wings and soar to new heights this birthday!",
      "Like a sunflower, may you always turn towards the light and grow.",
      "Here's to more laughter, more adventures, and more beautiful moments!",
      "Luck, love, and happiness — may they follow you everywhere you go.",
    ],
    celebrationGifs: [
      "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyeXBzMDZ3djd6ZnAxZjJkcmVoZ28weGlrYzl5M3ZrbTFraWZ4Y3J6dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif",
      "https://media2.giphy.com/media/v1.Y2lkPTZjMDliUycmJieHBuNjN3bDk3OGg1ZG9za203aDlrMjV1cDJvb24wNTV4bTg2cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lMameLIF8voLu8HxWV/giphy.gif",
    ],
    musicChoice: "royalty_free_1",
  },
  "pink-romance": {
    birthdayPerson: "Priya",
    greetingMessage: "You're the most adorable human I have ever met! 💕",
    entryButtonText: "Click to Enter Our World 💕",
    reasons: [
      "Your laugh is literally my favorite sound in the whole world.",
      "You always know how to make me smile even on my worst days.",
      "You have the kindest heart and sweetest soul.",
      "Every memory with you feels like a beautiful scene from a movie.",
    ],
    reasonGifs: [
      "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyeXBzMDZ3djd6ZnAxZjJkcmVoZ28weGlrYzl5M3ZrbTFraWZ4Y3J6dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif",
    ],
    memoryPhotos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop",
    ],
    memoryCaptions: ["First Date", "Weekend Getaway", "Sunset Walks", "Forever Us"],
    memoryDescriptions: [
      "A magical evening under the twinkling fairy lights",
      "Endless laughter and breeze by the beach",
      "Holding hands as the golden hour faded",
      "Here's to a lifetime of love, warmth, and joy",
    ],
    finalMessage:
      "Happy Birthday my love! May this year bring you all the magic, happiness, and peace you bring into my life every single day. 💖",
    endingImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop",
  },
  "blush-elegance": {
    birthdayPerson: "Akanksha",
    heroImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&auto=format&fit=crop",
    heroTagline: "a little universe made just for you ✨",
    heroDescription:
      "Today is wrapped in blush light, tiny stars, warm memories, and all the love you deserve.",
    countdownDate: "2026-12-31T00:00",
    memoryPhotos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop",
    ],
    memoryCaptions: [
      "Summer Sunset",
      "City Lights",
      "Coffee Morning",
      "Laughter",
      "Starry Night",
      "Forever Smile",
    ],
    reasons: [
      "Your kindness illuminates every room.",
      "You make simple moments unforgettable.",
      "Your grace and positivity inspire me daily.",
      "You listen with your whole heart.",
      "Your happiness is infectious.",
      "You are truly one of a kind.",
      "You always know how to comfort my heart.",
      "Your smile feels like warm golden hour.",
      "You turn regular days into beautiful stories.",
      "You are loved more than words could ever say.",
    ],
    letterContent:
      "Dearest Akanksha,\n\nHappy Birthday! Creating this digital haven for you is just a small gesture to reflect how much light, kindness, and beauty you bring into my world every day.\n\nMay this year be filled with warm smiles, boundless joy, and unforgettable adventures. Thank you for simply being you.\n\nWith infinite love & admiration.",
    finalMessage: "You'll always be my favorite chapter.",
    finalImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&auto=format&fit=crop",
  },
};

export function mergeWithDefaults(
  templateSlug: string,
  userValues: Record<string, unknown> = {}
): Record<string, unknown> {
  const defaults = TEMPLATE_DEFAULTS[templateSlug] || {};
  const merged: Record<string, unknown> = { ...defaults };

  for (const [key, val] of Object.entries(userValues)) {
    if (val !== undefined && val !== null) {
      if (typeof val === "string" && val.trim().length > 0) {
        merged[key] = val.trim();
      } else if (Array.isArray(val)) {
        const nonEmpty = val.filter((item) => typeof item === "string" ? item.trim().length > 0 : Boolean(item));
        if (nonEmpty.length > 0) {
          merged[key] = nonEmpty;
        }
      } else if (typeof val === "number" || typeof val === "boolean" || typeof val === "object") {
        merged[key] = val;
      }
    }
  }

  return merged;
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
    const enrichedData = mergeWithDefaults(templateSlug, data);

    const slug = await generateSlug(
      (enrichedData.birthdayPerson as string) || (data.birthdayPerson as string) || "",
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
        data: enrichedData,
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

  const existingData = (project.data as Record<string, unknown>) || {};
  const updatedData = { ...existingData, ...data };

  await db
    .update(projects)
    .set({ data: updatedData, updatedAt: new Date() })
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
