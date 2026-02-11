
/**
 * Utility functions for handling CDN images
 */

const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_BASEURL || 
  "https://cdn-nextshop.prospectbdltd.com/api/temporary-url";

/**
 * Check if a string is a UUID
 */
export function isUUID(str: string): boolean {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Resolve a UUID to a temporary CDN URL
 */
export function getCDNImageUrl(imageValue: string | null | undefined): string {
  if (!imageValue) {
    return "/placeholder-product.png"; // Fallback image
  }

  // If it's already a full URL, return as-is
  if (imageValue.startsWith("http://") || imageValue.startsWith("https://")) {
    return imageValue;
  }

  // If it's a UUID, construct the CDN URL
  if (isUUID(imageValue)) {
    return `${CDN_BASE_URL}/${imageValue}`;
  }

  // Otherwise, return as-is (might be a relative path)
  return imageValue;
}

/**
 * Get multiple image URLs from an array of UUIDs/URLs
 */
export function getCDNImageUrls(images: (string | null | undefined)[]): string[] {
  return images.map(getCDNImageUrl);
}