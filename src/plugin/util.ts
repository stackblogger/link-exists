import { REGEX_PREPEND_PROTOCOL, REGEX_VALID_URL } from './constants';

/**
 * Format a string url with URL class
 *
 * @param url url to be reformed
 * @param includeProtocol validate url with or without protocol
 * @returns {URL | null} URL formatted object
 */
export function reformUrl(url: string, includeProtocol?: boolean): URL | null {
  try {
    let localUrl = url;
    if (typeof includeProtocol === 'boolean' && includeProtocol === true) {
      localUrl = !REGEX_PREPEND_PROTOCOL.test(localUrl) ? `http://${localUrl}` : localUrl;
    }
    return new URL(localUrl.trim());
  } catch (_e) {
    return null;
  }
}

/**
 * validates a url using javascript regex
 *
 * @param url url to validate
 * @returns true / false whether a given url is valid
 */
export function isValidUrl(url: string): boolean {
  return url.match(REGEX_VALID_URL) !== null;
}
