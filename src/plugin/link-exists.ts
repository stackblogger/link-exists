import http from 'http';
import { isValidUrl, reformUrl } from './util';

/**
 * Check whether a link exists or not.
 *
 * @param link string url to be checked
 * @returns {boolean} returns whether the given link is reachable or not
 */
export async function linkExists(link: string): Promise<boolean> {
  if (typeof link !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof link}`);
  }
  const isItValid = isValidUrl(link);
  if (typeof isItValid === 'boolean' && isItValid === false) return false;
  const reformedUrl = reformUrl(link);
  if (!reformedUrl) return false;

  const { host, pathname } = reformedUrl;
  const opt = { method: 'HEAD', host, path: pathname };

  return new Promise((resolve) => {
    const req = http.request(opt, () => resolve(true));

    req.on('error', () => resolve(false));
    req.end();
  });
}
