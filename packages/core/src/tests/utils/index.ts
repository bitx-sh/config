//// @ts-check
/**
 * @fileoverview Test utilities
 * @package @bitx-sh/config
 */

///// <reference types="typescript" />
///// <reference types="bun-types" />

/**
 * Creates test plugin
 * @function createTestPlugin
 *
 * @param {string} name - Plugin name
 * @param {Partial<Plugin>} implementation - Plugin implementation
 * @returns {Plugin}
 *
 * @example
 * ```typescript
 * const plugin = createTestPlugin('test', {
 *   setup: async () => {
 *     // Setup logic
 *   }
 * });
 * ```
 */
export function createTestPlugin(
  name: string,
  implementation?: Partial<Plugin>
): Plugin;

/**
 * Mocks file system
 * @function mockFileSystem
 *
 * @param {Record<string, string>} files - Mock files
 * @returns {void}
 *
 * @example
 * ```typescript
 * mockFileSystem({
 *   '/config.json': '{"test": true}'
 * });
 * ```
 */
export function mockFileSystem(files: Record<string, string>): void;

/**
 * Mocks network
 * @function mockNetwork
 *
 * @param {Record<string, unknown>} responses - Mock responses
 * @returns {void}
 *
 * @example
 * ```typescript
 * mockNetwork({
 *   'https://example.com': { status: 200 }
 * });
 * ```
 */
export function mockNetwork(responses: Record<string, unknown>): void;

/**
 * Creates test context
 * @function createTestContext
 *
 * @returns {TestContext}
 *
 * @example
 * ```typescript
 * const ctx = createTestContext();
 * await runTest(ctx);
 * ```
 */
export function createTestContext(): TestContext;

/**
 * Test context interface
 * @interface TestContext
 */
export interface TestContext {
  /**
   * Core instance
   * @type {BitXCore}
   */
  core: BitXCore;

  /**
   * Test files
   * @type {Record<string, string>}
   */
  files: Record<string, string>;

  /**
   * Test plugins
   * @type {Plugin[]}
   */
  plugins: Plugin[];

  /**
   * Cleanup function
   * @type {() => Promise<void>}
   */
  cleanup: () => Promise<void>;
}

/**
 * Test fixture interface
 * @interface TestFixture
 */
export interface TestFixture {
  /**
   * Fixture name
   * @type {string}
   */
  name: string;

  /**
   * Fixture setup
   * @type {() => Promise<void>}
   */
  setup: () => Promise<void>;

  /**
   * Fixture teardown
   * @type {() => Promise<void>}
   */
  teardown: () => Promise<void>;
}
