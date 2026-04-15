import { linkExists } from '../src';
import type { LinkCheckResult } from '../src/plugin/link-exists';
import { isValidUrl, reformUrl } from '../src/plugin/util';

const validHttps = 'https://bookmymark.com';

describe('Validations', () => {
  it('should validate link variable type', async () => {
    const link = JSON.parse('{}');
    try {
      await linkExists(link);
    } catch (error) {
      expect(error).toStrictEqual(new TypeError(`Expected a string, got ${typeof link}`));
    }
  });

  it('should validate config type', async () => {
    const value = JSON.parse('{}');
    try {
      await linkExists(validHttps, { ignoreProtocol: value });
    } catch (error) {
      expect(error).toStrictEqual(new TypeError(`Expected a boolean, got ${typeof value}`));
    }
  });

  it('should validate timeout type', async () => {
    try {
      await linkExists(validHttps, { timeout: Number.NaN });
    } catch (error) {
      expect(error).toStrictEqual(new TypeError('Expected timeout to be a non-negative finite number'));
    }
  });

  it('should validate method type', async () => {
    try {
      await linkExists(validHttps, { method: 'POST' as 'HEAD' });
    } catch (error) {
      expect(error).toStrictEqual(new TypeError('Expected method to be HEAD or GET'));
    }
  });

  it('should validate fallbackToGet type', async () => {
    try {
      await linkExists(validHttps, { fallbackToGet: 1 as unknown as boolean });
    } catch (error) {
      expect(error).toStrictEqual(new TypeError('Expected a boolean, got number'));
    }
  });

  it('should validate details type', async () => {
    try {
      await linkExists(validHttps, { details: 1 as unknown as boolean });
    } catch (error) {
      expect(error).toStrictEqual(new TypeError('Expected a boolean, got number'));
    }
  });

  it('should reform url', async () => {
    const result = reformUrl(validHttps);
    expect(result).toBeInstanceOf(URL);
  });

  it('should not reform url', async () => {
    const result = reformUrl('bookmymark.com');
    expect(result).toBe(null);
  });

  it('should reform url with includeProtocol true', async () => {
    const result = reformUrl('bookmymark.com', true);
    expect(result).toBeInstanceOf(URL);
  });

  it('should reform url with includeProtocol true', async () => {
    const result = reformUrl(validHttps, true);
    expect(result).toBeInstanceOf(URL);
  });

  it('should not be a valid url', async () => {
    const result = isValidUrl('some test url .com');
    expect(result).toBe(false);
  });

  it('should not be a valid url', async () => {
    const result = await linkExists('some test url .com');
    expect(result).toBe(false);
  });
});

describe('Link Exist', () => {
  it('should exist', async () => {
    const result = await linkExists(validHttps);
    expect(result).toBe(true);
  });

  it('should exist', async () => {
    const result = await linkExists('https://www.evrig.com/blog/how-to-check-magento-version/');
    expect(result).toBe(true);
  });

  it('should exist', async () => {
    const result = await linkExists('https://photoluxcommercialstudio.com/');
    expect(result).toBe(true);
  });

  it('should exist', async () => {
    const result = await linkExists('https://www.synerchii.com/');
    expect(result).toBe(true);
  });

  it('should exist', async () => {
    const result = await linkExists('https://rb.gy/cfzux');
    expect(result).toBe(true);
  });

  it('should exist', async () => {
    const result = await linkExists('https://www.fizzygoblet.com/collections/kolha-wedge');
    expect(result).toBe(true);
  });

  it('should exist without protocol and with ignoreProtocol true', async () => {
    const result = await linkExists('bookmymark.com', { ignoreProtocol: true });
    expect(result).toBe(true);
  });
});

describe('fetch options', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('retries with GET when HEAD throws', async () => {
    const fetchMock = jest.fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({} as Response);
    global.fetch = fetchMock as typeof fetch;

    await expect(linkExists(validHttps)).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'HEAD' });
    expect(fetchMock.mock.calls[1][1]).toMatchObject({ method: 'GET' });
  });

  it('does not retry GET when fallbackToGet is false', async () => {
    const fetchMock = jest.fn().mockRejectedValue(new Error('network'));
    global.fetch = fetchMock as typeof fetch;

    await expect(linkExists(validHttps, { fallbackToGet: false })).resolves.toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('uses GET only when method is GET', async () => {
    const fetchMock = jest.fn().mockResolvedValue({} as Response);
    global.fetch = fetchMock as typeof fetch;

    await expect(linkExists(validHttps, { method: 'GET' })).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'GET' });
  });

  it('returns false when request exceeds timeout', async () => {
    const fetchMock = jest.fn((_url, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      const signal = init?.signal;
      if (!signal) return;
      const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
      if (signal.aborted) {
        onAbort();
        return;
      }
      signal.addEventListener('abort', onAbort, { once: true });
    }));
    global.fetch = fetchMock as typeof fetch;

    await expect(linkExists(validHttps, { timeout: 30 })).resolves.toBe(false);
    expect(fetchMock).toHaveBeenCalled();
  });

  it('returns false when fetch is unavailable', async () => {
    const saved = global.fetch;
    Reflect.deleteProperty(global, 'fetch');
    await expect(linkExists(validHttps)).resolves.toBe(false);
    global.fetch = saved;
  });
});

/**
 * When `details: true`, the library returns an object instead of a boolean.
 * These tests use a fake `fetch` so we do not depend on the real network.
 */
describe('details response', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  function mockResponse(partial: Partial<Response> & Pick<Response, 'ok' | 'status' | 'url'>): Response {
    return partial as Response;
  }

  it('returns an object when details is true and the request succeeds', async () => {
    const body = mockResponse({
      ok: true,
      status: 200,
      url: `${validHttps}/`,
    });
    global.fetch = jest.fn().mockResolvedValue(body) as typeof fetch;

    const result = await linkExists(validHttps, { details: true });

    expect(result).toEqual<LinkCheckResult>({
      exists: true,
      status: 200,
      url: `${validHttps}/`,
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('uses exists false when the HTTP status is not ok', async () => {
    const body = mockResponse({
      ok: false,
      status: 404,
      url: validHttps,
    });
    global.fetch = jest.fn().mockResolvedValue(body) as typeof fetch;

    const result = await linkExists(validHttps, { details: true, method: 'GET' });

    expect(result).toEqual<LinkCheckResult>({
      exists: false,
      status: 404,
      url: validHttps,
    });
  });

  it('returns the GET response object after HEAD fails', async () => {
    const getBody = mockResponse({
      ok: true,
      status: 200,
      url: validHttps,
    });
    global.fetch = jest.fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(getBody) as typeof fetch;

    const result = await linkExists(validHttps, { details: true });

    expect(result).toEqual<LinkCheckResult>({
      exists: true,
      status: 200,
      url: validHttps,
    });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('returns a failure object when the request fails and details is true', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network')) as typeof fetch;

    const result = await linkExists(validHttps, { details: true, fallbackToGet: false });
    const expectedUrl = reformUrl(validHttps)!.href;

    expect(result).toEqual<LinkCheckResult>({
      exists: false,
      status: 0,
      url: expectedUrl,
    });
  });

  it('returns a failure object for a bad URL when details is true', async () => {
    const bad = 'not a real url .com';
    const result = await linkExists(bad, { details: true });

    expect(result).toEqual<LinkCheckResult>({
      exists: false,
      status: 0,
      url: bad,
    });
  });

  it('still returns a boolean when details is false', async () => {
    const body = mockResponse({ ok: true, status: 200, url: validHttps });
    global.fetch = jest.fn().mockResolvedValue(body) as typeof fetch;

    const result = await linkExists(validHttps, { details: false });

    expect(typeof result).toBe('boolean');
    expect(result).toBe(true);
  });

  it('returns a failure object when the URL cannot be opened and details is true', async () => {
    const hostOnly = 'bookmymark.com';
    const result = await linkExists(hostOnly, { details: true });

    expect(result).toEqual<LinkCheckResult>({
      exists: false,
      status: 0,
      url: hostOnly,
    });
  });

  it('returns a failure object when fetch is missing and details is true', async () => {
    const saved = global.fetch;
    Reflect.deleteProperty(global, 'fetch');
    const result = await linkExists(validHttps, { details: true });
    global.fetch = saved;

    expect(result).toEqual<LinkCheckResult>({
      exists: false,
      status: 0,
      url: reformUrl(validHttps)!.href,
    });
  });

  it('returns a failure object when GET times out and details is true', async () => {
    const fetchMock = jest.fn((_url, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      const signal = init?.signal;
      if (!signal) return;
      const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
      if (signal.aborted) {
        onAbort();
        return;
      }
      signal.addEventListener('abort', onAbort, { once: true });
    }));
    global.fetch = fetchMock as typeof fetch;

    const result = await linkExists(validHttps, { details: true, method: 'GET', timeout: 30 });
    const expectedUrl = reformUrl(validHttps)!.href;

    expect(result).toEqual<LinkCheckResult>({
      exists: false,
      status: 0,
      url: expectedUrl,
    });
  });

  it('returns a failure object when HEAD and GET both fail and details is true', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network')) as typeof fetch;
    const expectedUrl = reformUrl(validHttps)!.href;

    const result = await linkExists(validHttps, { details: true });

    expect(result).toEqual<LinkCheckResult>({
      exists: false,
      status: 0,
      url: expectedUrl,
    });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});

describe('Link Not Exist', () => {
  it('should not exist', async () => {
    const dead = 'https://this-host-should-not-resolve.invalid/';
    const result = await linkExists(dead);
    expect(result).toBe(false);
  });

  it('should not exist without protocol and with ignoreProtocol false', async () => {
    const result = await linkExists('bookmymark.com', { ignoreProtocol: false });
    expect(result).toBe(false);
  });

  it('should not exist without protocol and without config', async () => {
    const result = await linkExists('bookmymark.com');
    expect(result).toBe(false);
  });
});
