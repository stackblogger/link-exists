import http from 'http';
import { reformUrl } from './util';

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
  const valid = reformUrl(link);
  if (!valid) return false;

  const { host, pathname } = valid;
  const opt = { method: 'HEAD', host, path: pathname };

  return new Promise((resolve) => {
    const req = http.request(opt, (r) => resolve(/4\d\d/.test(`${r.statusCode}`) === false));

    req.on('error', () => resolve(false));
    req.end();
  });
}
