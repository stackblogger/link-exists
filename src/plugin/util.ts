/**
 * Format a string url with URL class
 *
 * @param url url to be reformed
 * @returns {URL | null} URL formatted object
 */
export function reformUrl(url: string): URL | null {
  try {
    return new URL(url.trim());
  } catch (_e) {
    return null;
  }
}
