import type { ComponentType } from "react";
import type { RendererProps } from "@/types";

// Lazy-loaded renderer components
const renderers: Record<
  string,
  () => Promise<{ default: ComponentType<RendererProps> }>
> = {
  "elegant-single-page": () =>
    import("./renderers/elegant-single-page").then((mod) => ({
      default: mod.default,
    })),
  "romantic-multi-page": () =>
    import("./renderers/romantic-multi-page").then((mod) => ({
      default: mod.default,
    })),
  "luxe-multi-page": () =>
    import("./renderers/luxe-multi-page").then((mod) => ({
      default: mod.default,
    })),
};

/**
 * Get a renderer component by its key. Returns null if not found.
 */
export async function getRenderer(
  rendererKey: string
): Promise<ComponentType<RendererProps> | null> {
  const loader = renderers[rendererKey];
  if (!loader) return null;

  try {
    const { default: Component } = await loader();
    return Component;
  } catch (error) {
    console.error(`Failed to load renderer "${rendererKey}":`, error);
    return null;
  }
}

/**
 * Check if a renderer key is valid.
 */
export function isValidRenderer(rendererKey: string): boolean {
  return rendererKey in renderers;
}

/**
 * Get all available renderer keys.
 */
export function getRendererKeys(): string[] {
  return Object.keys(renderers);
}

// Template metadata for the registry
export interface TemplateRegistryEntry {
  slug: string;
  name: string;
  description: string;
  category: string;
  rendererKey: string;
  schemaPath: string;
  themePath: string;
  thumbnailUrl?: string;
  previewUrl?: string;
}

/**
 * Static template registry — maps template slugs to their metadata.
 * This is the source of truth for what templates are available.
 * In production, this would come from the database.
 */
export const TEMPLATE_REGISTRY: TemplateRegistryEntry[] = [
  {
    slug: "starlit-celebration",
    name: "Starlit Celebration",
    description:
      "An elegant, single-page birthday experience with golden particles, interactive candle blowing, and a stunning photo gallery. Perfect for anyone who deserves a magical surprise.",
    category: "Premium Animated",
    rendererKey: "elegant-single-page",
    schemaPath: "./schemas/starlit-celebration.json",
    themePath: "./themes/starlit-celebration.json",
  },
  {
    slug: "pink-romance",
    name: "Pink Romance",
    description:
      "A romantic multi-section experience with typing effects, floating emojis, progressive card reveals, and memory photo grids with sparkles. Perfect for someone you love.",
    category: "Romantic",
    rendererKey: "romantic-multi-page",
    schemaPath: "./schemas/pink-romance.json",
    themePath: "./themes/pink-romance.json",
  },
  {
    slug: "blush-elegance",
    name: "Blush Elegance",
    description:
      "A luxurious, multi-page experience with countdown timer, polaroid memories, flip-card reasons, a love letter with envelope animation, and an interactive 3D cake. The ultimate birthday surprise.",
    category: "Luxury",
    rendererKey: "luxe-multi-page",
    schemaPath: "./schemas/blush-elegance.json",
    themePath: "./themes/blush-elegance.json",
  },
];
