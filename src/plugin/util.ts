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

const REGEX_VALID_URL =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

export function isValidUrl(url: string): boolean {
  return url.match(REGEX_VALID_URL) !== null;
}
