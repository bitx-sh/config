//// @ts-check
/**
 * @fileoverview Test helpers
 * @package @bitx-sh/config
 */

///// <reference types="typescript" />
///// <reference types="bun-types" />

/**
 * Creates test schema
 * @function createTestSchema
 *
 * @param {Partial<Schema>} schema - Schema definition
 * @returns {Schema}
 *
 * @example
 * ```typescript
 * const schema = createTestSchema({
 *   type: 'object',
 *   properties: {
 *     test: { type: 'boolean' }
 *   }
 * });
 * ```
 */
export function createTestSchema(schema?: Partial<Schema>): Schema;

/**
 * Creates test config
 * @function createTestConfig
 *
 * @param {Partial<Config>} config - Config definition
 * @returns {Config}
 *
 * @example
 * ```typescript
 * const config = createTestConfig({
 *   test: true
 * });
 * ```
 */
export function createTestConfig(config?: Partial<Config>): Config;

/**
 * Runs test with timeout
 * @function withTimeout
 *
 * @param {() => Promise<void>} fn - Test function
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await withTimeout(async () => {
 *   // Test logic
 * }, 1000);
 * ```
 */
export function withTimeout(
  fn: () => Promise<void>,
  timeout: number
): Promise<void>;

/**
 * Creates test logger
 * @function createTestLogger
 *
 * @returns {Logger}
 *
 * @example
 * ```typescript
 * const logger = createTestLogger();
 * logger.info('test');
 * ```
 */
export function createTestLogger(): Logger;
