import { linkExists } from '../src';
import { isValidUrl, reformUrl } from '../src/plugin/util';

describe('LinkExists', () => {
  it('should exist', async () => {
    const result = await linkExists('https://bookmymark.com');
    expect(result).toBe(true);
  });

  it('should not exist', async () => {
    const result = await linkExists('https://sbbbookmymark.com');
    expect(result).toBe(false);
  });

  it('should reform url', async () => {
    const result = reformUrl('https://bookmymark.com');
    expect(result).toBeInstanceOf(URL);
  });

  it('should not reform url', async () => {
    const result = reformUrl('bookmymark.com');
    expect(result).toBe(null);
  });

  it('should not be a valid url', async () => {
    const result = isValidUrl('some test url .com');
    expect(result).toBe(false);
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
});
