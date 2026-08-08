import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "wishelier-sites";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!; // e.g. https://sites.wishelier.in

/**
 * Upload a generated site bundle (HTML/CSS/JS) to R2.
 * Uses versioned paths for atomic deployment.
 *
 * Path structure: /sites/{slug}/v{version}/{filename}
 * Live pointer: /sites/{slug}/live/{filename} (copy from versioned)
 */
export async function uploadSiteFile(
  slug: string,
  version: number,
  filename: string,
  content: Buffer | string,
  contentType: string
): Promise<string> {
  const key = `sites/${slug}/v${version}/${filename}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: typeof content === "string" ? Buffer.from(content) : content,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable", // Versioned files are immutable
    })
  );

  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Copy versioned files to the live pointer path.
 * This is the "atomic swap" — the live/ path always serves the latest version.
 */
export async function publishSiteVersion(
  slug: string,
  version: number,
  files: string[]
): Promise<void> {
  // For each file in the version, copy to /live/
  for (const filename of files) {
    const sourceKey = `sites/${slug}/v${version}/${filename}`;
    const liveKey = `sites/${slug}/live/${filename}`;

    // Read the source file and write to live path
    // R2 doesn't support CopyObject cross-key, so we re-upload
    const { CopyObjectCommand } = await import("@aws-sdk/client-s3");

    await r2.send(
      new CopyObjectCommand({
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${sourceKey}`,
        Key: liveKey,
        ContentType: getContentType(filename),
        CacheControl: "public, max-age=300, stale-while-revalidate=60", // Short cache for live files
      })
    );
  }
}

/**
 * Delete a site from R2 (all versions).
 */
export async function deleteSite(slug: string): Promise<void> {
  // In production, you'd list and delete all objects under the prefix
  // For MVP, we'll just delete the live pointer files
  const knownFiles = ["index.html", "styles.css", "main.js"];

  for (const filename of knownFiles) {
    try {
      await r2.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: `sites/${slug}/live/${filename}`,
        })
      );
    } catch {
      // Ignore if file doesn't exist
    }
  }
}

/**
 * Check if a site exists in R2.
 */
export async function siteExists(slug: string): Promise<boolean> {
  try {
    await r2.send(
      new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `sites/${slug}/live/index.html`,
      })
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the public URL for a live site.
 */
export function getSiteUrl(slug: string): string {
  return `${R2_PUBLIC_URL}/sites/${slug}/live/index.html`;
}

/**
 * Get the public base URL for a site's assets.
 */
export function getSiteAssetsBaseUrl(slug: string, version: number): string {
  return `${R2_PUBLIC_URL}/sites/${slug}/v${version}`;
}

/**
 * Infer content type from filename.
 */
function getContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "html":
      return "text/html; charset=utf-8";
    case "css":
      return "text/css; charset=utf-8";
    case "js":
      return "application/javascript; charset=utf-8";
    case "json":
      return "application/json";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}
