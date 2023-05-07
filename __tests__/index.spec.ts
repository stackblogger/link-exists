import { linkExists } from '../src';
import { reformUrl } from '../src/plugin/util';

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
});
