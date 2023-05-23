import http from 'http';
import { isValidUrl, reformUrl } from './util';
import { LinkValidatorConfig } from './config';

/**
 * Check whether a link exists or not.
 *
 * @param link string url to be checked
 * @param config optional configuration to run validator as per your custom requirement
 * @returns {boolean} returns whether the given link is reachable or nots
 */
export async function linkExists(link: string, config?: LinkValidatorConfig): Promise<boolean> {
  if (typeof link !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof link}`);
  }
  if (config && config.ignoreProtocol && typeof config.ignoreProtocol !== 'boolean') {
    throw new TypeError(`Expected a boolean, got ${typeof config.ignoreProtocol}`);
  }
  const isItValid = isValidUrl(link);
  if (typeof isItValid === 'boolean' && isItValid === false) return false;
  const reformedUrl = reformUrl(link, config?.ignoreProtocol);
  if (!reformedUrl) return false;

  const { host, pathname } = reformedUrl;
  const opt = { method: 'HEAD', host, path: pathname };

  return new Promise((resolve) => {
    const req = http.request(opt, () => resolve(true));

    req.on('error', () => resolve(false));
    req.end();
  });
}
