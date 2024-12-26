//// @ts-check
/**
 * @fileoverview Plugin loader implementation
 * @package @bitx-sh/config
 */

///// <reference types="typescript" />
///// <reference types="bun-types" />

import type { Plugin, PluginSource } from "../types";

/**
 * Plugin loader class
 * @class PluginLoader
 *
 * @description
 * Handles plugin discovery, loading, and validation.
 * Supports loading from filesystem, npm, and GitHub.
 *
 * @example
 * ```typescript
 * const loader = new PluginLoader();
 * const plugin = await loader.load('@bitx-sh/plugin-biome');
 * ```
 */
export class PluginLoader {
  /**
   * Plugin cache
   * @private
   * @type {Map<string, Plugin>}
   */
  private cache: Map<string, Plugin>;

  /**
   * Creates plugin loader
   * @constructor
   */
  constructor();

  /**
   * Loads plugin
   * @param {string} source - Plugin source
   * @returns {Promise<Plugin>}
   *
   * @throws {PluginError} When loading fails
   * @emits {PluginEvent} load - When plugin is loaded
   */
  async load(source: string): Promise<Plugin>;

  /**
   * Loads local plugin
   * @private
   * @param {string} path - Plugin path
   * @returns {Promise<Plugin>}
   */
  private loadLocal(path: string): Promise<Plugin>;

  /**
   * Loads npm plugin
   * @private
   * @param {string} name - Package name
   * @returns {Promise<Plugin>}
   */
  private loadNpm(name: string): Promise<Plugin>;

  /**
   * Loads GitHub plugin
   * @private
   * @param {string} repo - Repository URL
   * @returns {Promise<Plugin>}
   */
  private loadGithub(repo: string): Promise<Plugin>;

  /**
   * Validates plugin
   * @private
   * @param {unknown} module - Loaded module
   * @returns {Promise<void>}
   *
   * @throws {PluginError} When validation fails
   */
  private validatePlugin(module: unknown): Promise<void>;
}

/**
 * Plugin source type
 * @type {PluginSource}
 */
export type PluginSource = 'local' | 'npm' | 'github';

/**
 * Plugin load options interface
 * @interface PluginLoadOptions
 */
export interface PluginLoadOptions {
  /**
   * Cache enabled flag
   * @type {boolean}
   */
  cache?: boolean;

  /**
   * Validation enabled flag
   * @type {boolean}
   */
  validate?: boolean;

  /**
   * Load timeout
   * @type {number}
   */
  timeout?: number;
}
