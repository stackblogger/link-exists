import type { LinkValidatorConfig } from './config';
import { isValidUrl, reformUrl } from './util';

export interface LinkCheckResult {
  exists: boolean;
  status: number;
  url: string;
}

type Opts = LinkValidatorConfig;
type WithDetailsConfig = Opts & { details: true };
type LinkExistsUnion = boolean | LinkCheckResult;

function validateConfig(config?: LinkValidatorConfig): void {
  if (!config) return;
  if (config.ignoreProtocol && typeof config.ignoreProtocol !== 'boolean') {
    throw new TypeError(`Expected a boolean, got ${typeof config.ignoreProtocol}`);
  }
  if (config.timeout !== undefined) {
    if (typeof config.timeout !== 'number' || !Number.isFinite(config.timeout) || config.timeout < 0) {
      throw new TypeError('Expected timeout to be a non-negative finite number');
    }
  }
  if (config.method !== undefined && config.method !== 'HEAD' && config.method !== 'GET') {
    throw new TypeError('Expected method to be HEAD or GET');
  }
  if (config.fallbackToGet !== undefined && typeof config.fallbackToGet !== 'boolean') {
    throw new TypeError(`Expected a boolean, got ${typeof config.fallbackToGet}`);
  }
  if (config.details !== undefined && typeof config.details !== 'boolean') {
    throw new TypeError(`Expected a boolean, got ${typeof config.details}`);
  }
}

function createTimedAbort(timeoutMs?: number): { signal: AbortSignal; clearTimer: () => void } {
  const controller = new AbortController();
  if (timeoutMs === undefined || timeoutMs <= 0) {
    return { signal: controller.signal, clearTimer: () => {} };
  }
  const timerId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  const clearTimer = () => {
    clearTimeout(timerId);
  };
  return { signal: controller.signal, clearTimer };
}

async function fetchResponse(url: string, method: 'HEAD' | 'GET', signal: AbortSignal): Promise<Response | null> {
  try {
    return await fetch(url, { method, redirect: 'follow', signal });
  } catch {
    return null;
  }
}

function responseToResult(res: Response): LinkCheckResult {
  return { exists: res.ok, status: res.status, url: res.url };
}

function failureResult(fallbackUrl: string): LinkCheckResult {
  return { exists: false, status: 0, url: fallbackUrl };
}

/**
 * Checks if a URL responds on the network. Returns true when a response is received.
 * Returns false for bad URLs, timeouts, and network errors.
 * Throws only if `link` is not a string or if a config field has the wrong type.
 *
 * If `config.details` is true, you get an object with `exists`, `status`, and `url`.
 * If `details` is false or missing, you get a boolean like before.
 *
 * @param link - The URL string to check.
 * @param config - Optional settings. See `LinkValidatorConfig`.
 * @returns A promise with true or false, or with a result object when `details` is true.
 *
 * @example
 * await linkExists('https://example.com');
 *
 * @example
 * await linkExists('example.com', { ignoreProtocol: true });
 *
 * @example
 * await linkExists('https://example.com', { details: true });
 */
export async function linkExists(link: string, config?: Opts): Promise<boolean>;
export async function linkExists(link: string, config: WithDetailsConfig): Promise<LinkCheckResult>;
export async function linkExists(link: string, config?: Opts): Promise<LinkExistsUnion> {
  if (typeof link !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof link}`);
  }
  validateConfig(config);

  const wantDetails = config?.details === true;

  if (!isValidUrl(link)) {
    return wantDetails ? failureResult(link) : false;
  }

  const reformedUrl = reformUrl(link, config?.ignoreProtocol);
  if (!reformedUrl) {
    return wantDetails ? failureResult(link.trim()) : false;
  }

  if (typeof AbortController === 'undefined' || typeof fetch !== 'function') {
    return wantDetails ? failureResult(reformedUrl.href) : false;
  }

  const { href } = reformedUrl;
  const timeoutMs = config?.timeout;
  const method = config?.method ?? 'HEAD';
  const allowGetFallback = config?.fallbackToGet !== false;

  if (method === 'GET') {
    const timed = createTimedAbort(timeoutMs);
    try {
      const res = await fetchResponse(href, 'GET', timed.signal);
      if (wantDetails) {
        return res ? responseToResult(res) : failureResult(href);
      }
      return res !== null;
    } finally {
      timed.clearTimer();
    }
  }

  const headTimed = createTimedAbort(timeoutMs);
  let headRes: Response | null = null;
  try {
    headRes = await fetchResponse(href, 'HEAD', headTimed.signal);
  } finally {
    headTimed.clearTimer();
  }

  if (headRes !== null) {
    return wantDetails ? responseToResult(headRes) : true;
  }
  if (!allowGetFallback) {
    return wantDetails ? failureResult(href) : false;
  }

  const getTimed = createTimedAbort(timeoutMs);
  try {
    const getRes = await fetchResponse(href, 'GET', getTimed.signal);
    if (wantDetails) {
      return getRes ? responseToResult(getRes) : failureResult(href);
    }
    return getRes !== null;
  } finally {
    getTimed.clearTimer();
  }
}
