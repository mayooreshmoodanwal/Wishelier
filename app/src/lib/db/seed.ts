import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { config } from "dotenv";
import * as schema from "./schema";

config({ path: ".env.local" });

// Import schemas and themes as JSON
import starlitSchema from "@/template-engine/schemas/starlit-celebration.json";
import starlitTheme from "@/template-engine/themes/starlit-celebration.json";
import pinkSchema from "@/template-engine/schemas/pink-romance.json";
import pinkTheme from "@/template-engine/themes/pink-romance.json";
import blushSchema from "@/template-engine/schemas/blush-elegance.json";
import blushTheme from "@/template-engine/themes/blush-elegance.json";

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("🌱 Seeding database...");

  // 1. Seed event types
  console.log("  → Event types...");
  await db
    .insert(schema.eventTypes)
    .values([
      { key: "birthday", label: "Birthday", active: true },
      { key: "anniversary", label: "Anniversary", active: false },
      { key: "graduation", label: "Graduation", active: false },
      { key: "valentines", label: "Valentine's Day", active: false },
    ])
    .onConflictDoNothing();

  // Get the birthday event type ID
  const [birthday] = await db
    .select({ id: schema.eventTypes.id })
    .from(schema.eventTypes)
    .where(eq(schema.eventTypes.key, "birthday"))
    .limit(1);

  if (!birthday) throw new Error("Birthday event type not found after insert");

  // 2. Seed templates
  console.log("  → Templates...");

  const templateData = [
    {
      slug: "starlit-celebration",
      name: "Starlit Celebration",
      category: "Premium Animated",
      rendererKey: "elegant-single-page",
      pricingTier: "premium" as const,
      priceAmount: "99.00",
      originalPrice: "399.00",
      schema: starlitSchema,
      theme: starlitTheme,
    },
    {
      slug: "pink-romance",
      name: "Pink Romance",
      category: "Romantic",
      rendererKey: "romantic-multi-page",
      pricingTier: "standard" as const,
      priceAmount: "99.00",
      originalPrice: "399.00",
      schema: pinkSchema,
      theme: pinkTheme,
    },
    {
      slug: "blush-elegance",
      name: "Blush Elegance",
      category: "Luxury",
      rendererKey: "luxe-multi-page",
      pricingTier: "luxury" as const,
      priceAmount: "99.00",
      originalPrice: "399.00",
      schema: blushSchema,
      theme: blushTheme,
    },
  ];

  for (const tmpl of templateData) {
    const [template] = await db
      .insert(schema.templates)
      .values({
        slug: tmpl.slug,
        name: tmpl.name,
        eventTypeId: birthday.id,
        category: tmpl.category,
        rendererKey: tmpl.rendererKey,
        pricingTier: tmpl.pricingTier,
        priceAmount: tmpl.priceAmount,
        originalPrice: tmpl.originalPrice,
      })
      .onConflictDoNothing()
      .returning();

    if (template) {
      // Create version 1
      await db
        .insert(schema.templateVersions)
        .values({
          templateId: template.id,
          version: 1,
          schema: tmpl.schema,
          theme: tmpl.theme,
          isCurrent: true,
        })
        .onConflictDoNothing();

      console.log(`    ✓ ${tmpl.name} (v1)`);
    } else {
      console.log(`    ⏭ ${tmpl.name} (already exists)`);
    }
  }

  console.log("✅ Seed complete!");
}

seed().catch(console.error);
