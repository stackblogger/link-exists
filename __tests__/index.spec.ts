import { linkExists } from '../src';
import { isValidUrl, reformUrl } from '../src/plugin/util';

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
      await linkExists('https://bookmymark.com', { ignoreProtocol: value });
    } catch (error) {
      expect(error).toStrictEqual(new TypeError(`Expected a boolean, got ${typeof value}`));
    }
  });

  it('should reform url', async () => {
    const result = reformUrl('https://bookmymark.com');
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
    const result = reformUrl('https://bookmymark.com', true);
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
    const result = await linkExists('https://bookmymark.com');
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

describe('Link Not Exist', () => {
  it('should not exist', async () => {
    const result = await linkExists('https://sbbbookmymark.com');
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
