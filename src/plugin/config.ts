interface LocalConfig {
  /**
   * default false.
   *
   * if `ignoreProtocol` is true, it will validate urls without https:// or http:// as fine.
   *
   * if `ignoreProtocol` is false (default), it will validate urls without https:// or http:// as not fine
   */
  ignoreProtocol: boolean;
}

/**
 * link validator configuration for custom validator
 */
export interface LinkValidatorConfig extends Partial<LocalConfig> {}
