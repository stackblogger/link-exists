/**
 * Extra settings for the `linkExists` function. All fields are optional.
 */
export interface LinkValidatorConfig {
  /**
   * Set to true if your link has no `http://` or `https://`.
   * Default is false. False means those links are treated as bad.
   *
   * @example
   * await linkExists('mysite.com', { ignoreProtocol: true });
   */
  ignoreProtocol?: boolean;

  /**
   * Stop waiting after this many milliseconds. No timeout if you skip this or use 0.
   *
   * @example
   * await linkExists('https://mysite.com', { timeout: 5000 });
   */
  timeout?: number;

  /**
   * How to call the server. `HEAD` is the default. Use `GET` if you only want a GET request.
   *
   * @example
   * await linkExists('https://mysite.com', { method: 'GET' });
   */
  method?: 'HEAD' | 'GET';

  /**
   * If `HEAD` fails, try again with `GET`. Default is true. Set false to skip the GET retry.
   *
   * @example
   * await linkExists('https://mysite.com', { fallbackToGet: false });
   */
  fallbackToGet?: boolean;

  /**
   * Set to true to get an object with `exists`, `status`, and `url` instead of a boolean.
   * Default is false. `exists` follows `response.ok` (good HTTP status range).
   *
   * @example
   * await linkExists('https://mysite.com', { details: true });
   */
  details?: boolean;
}
