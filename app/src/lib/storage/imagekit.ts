import { ImageKit } from "@imagekit/nodejs";
import crypto from "crypto";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY!;
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT!;

/**
 * Generate authentication parameters for client-side direct upload.
 * Returns token, expire, and signature for ImageKit upload widget.
 */
export function getUploadAuthParams() {
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!;

  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire.toString())
    .digest("hex");

  return { token, expire, signature };
}

/**
 * Upload a file to ImageKit (server-side).
 */
export async function uploadFile(
  file: Buffer | string,
  fileName: string,
  folder: string
) {
  return imagekit.files.upload({
    file: file as unknown as import("@imagekit/nodejs").Uploadable,
    fileName,
    folder: `/wishelier/${folder}`,
    useUniqueFileName: true,
  });
}

/**
 * Delete a file from ImageKit by file ID.
 */
export async function deleteFile(fileId: string) {
  return imagekit.files.delete(fileId);
}

/**
 * Generate a transformed image URL manually.
 * Since the new SDK doesn't have a .url() method, we build URLs from the endpoint.
 */
export function getTransformedUrl(
  filePath: string,
  transforms: Array<{ [key: string]: string | number }>
) {
  const transformStr = transforms
    .map((t) =>
      Object.entries(t)
        .map(([k, v]) => `${k}-${v}`)
        .join(",")
    )
    .join(",");

  return `${IMAGEKIT_URL_ENDPOINT}/tr:${transformStr}${filePath}`;
}

/**
 * Get optimized URL for a given image path.
 */
export function getOptimizedUrl(
  filePath: string,
  width?: number,
  height?: number,
  quality?: number
) {
  const parts: string[] = [];
  if (width) parts.push(`w-${width}`);
  if (height) parts.push(`h-${height}`);
  parts.push(`q-${quality || 80}`);
  parts.push("f-auto");

  return `${IMAGEKIT_URL_ENDPOINT}/tr:${parts.join(",")}${filePath}`;
}

// Content type allowlists
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp3",
];

/**
 * Validate a file's content type against allowed types.
 */
export function validateContentType(
  contentType: string,
  fieldType: "image" | "video" | "audio"
): boolean {
  switch (fieldType) {
    case "image":
      return ALLOWED_IMAGE_TYPES.includes(contentType);
    case "video":
      return ALLOWED_VIDEO_TYPES.includes(contentType);
    case "audio":
      return ALLOWED_AUDIO_TYPES.includes(contentType);
    default:
      return false;
  }
}

/**
 * Export public key and URL endpoint for client-side usage.
 */
export function getClientConfig() {
  return {
    publicKey: IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  };
}
