//// @ts-check
/**
 * @fileoverview Test fixtures
 * @package @bitx-sh/config
 */

///// <reference types="typescript" />
///// <reference types="bun-types" />

/**
 * Schema fixtures
 * @const {Record<string, Schema>}
 */
export const schemaFixtures: Record<string, Schema> = {
  // Fixture definitions
};

/**
 * Config fixtures
 * @const {Record<string, Config>}
 */
export const configFixtures: Record<string, Config> = {
  // Fixture definitions
};

/**
 * Plugin fixtures
 * @const {Record<string, Plugin>}
 */
export const pluginFixtures: Record<string, Plugin> = {
  // Fixture definitions
};

/**
 * Creates fixture
 * @function createFixture
 *
 * @param {string} name - Fixture name
 * @param {unknown} data - Fixture data
 * @returns {TestFixture}
 *
 * @example
 * ```typescript
 * const fixture = createFixture('test', {
 *   // Fixture data
 * });
 * ```
 */
export function createFixture(name: string, data: unknown): TestFixture;
