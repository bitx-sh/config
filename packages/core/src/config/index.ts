//// @ts-check
/**
 * @fileoverview Configuration management system
 * @package @bitx-sh/config
 */

///// <reference types="typescript" />
///// <reference type="bun-types" />

import { createUnconfig } from "unconfig";
import { z } from "zod";
import { defu } from "defu";
import type { ConfigSystem, ConfigSource, Config } from "../types";

/**
 * Configuration schema
 * @const {z.ZodObject}
 */
export const configSchema = z.object({
  // Schema definition
});

/**
 * Configuration manager class
 * @class ConfigManager
 *
 * @description
 * Manages configuration loading, validation, and persistence.
 * Supports multiple configuration sources and formats.
 *
 * @example
 * ```typescript
 * const manager = new ConfigManager();
 * await manager.load();
 * const value = manager.get('key');
 * ```
 */
export class ConfigManager implements ConfigSystem {
  /**
   * Configuration values
   * @private
   * @type {Config}
   */
  private config: Config = {};

  /**
   * Configuration sources
   * @private
   * @type {ConfigSource[]}
   */
  private sources: ConfigSource[] = [];

  /**
   * Creates configuration manager
   * @constructor
   */
  constructor();

  /**
   * Sets up default sources
   * @private
   * @returns {void}
   */
  private setupDefaultSources(): void;

  /**
   * Loads configuration
   * @param {ConfigSource[]} sources - Configuration sources
   * @returns {Promise<Config>}
   *
   * @throws {ConfigError} When loading fails
   * @emits {ConfigEvent} load - When configuration is loaded
   */
  async load(sources?: ConfigSource[]): Promise<Config>;

  /**
   * Gets configuration value
   * @param {string} key - Configuration key
   * @returns {T | undefined}
   */
  get<T>(key: string): T | undefined;

  /**
   * Sets configuration value
   * @param {string} key - Configuration key
   * @param {T} value - Configuration value
   * @returns {void}
   *
   * @throws {ConfigError} When setting fails
   * @emits {ConfigEvent} set - When value is set
   */
  set<T>(key: string, value: T): void;

  /**
   * Merges configuration
   * @param {Partial<Config>} config - Configuration to merge
   * @returns {void}
   */
  merge(config: Partial<Config>): void;

  /**
   * Saves configuration
   * @param {string} path - Output path
   * @returns {Promise<void>}
   *
   * @throws {ConfigError} When saving fails
   * @emits {ConfigEvent} save - When configuration is saved
   */
  async save(path?: string): Promise<void>;

  /**
   * Serializes configuration
   * @private
   * @returns {string}
   */
  private serialize(): string;
}
