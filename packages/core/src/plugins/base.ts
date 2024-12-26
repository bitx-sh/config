//// @ts-check
/**
 * @fileoverview Base plugin implementation
 * @package @bitx-sh/config
 */

///// <reference types="typescript" />
///// <reference types="bun-types" />

import type { Plugin, PluginContext, Schema } from "../types";

/**
 * Base plugin class
 * @abstract
 * @class BasePlugin
 *
 * @description
 * Abstract base class for plugin implementations.
 * Provides common functionality and enforces plugin interface.
 *
 * @example
 * ```typescript
 * class MyPlugin extends BasePlugin {
 *   name = 'my-plugin';
 *   version = '1.0.0';
 *
 *   async initialize() {
 *     // Plugin initialization
 *   }
 * }
 * ```
 */
export abstract class BasePlugin implements Plugin {
  /**
   * Plugin name
   * @abstract
   * @type {string}
   */
  abstract name: string;

  /**
   * Plugin version
   * @abstract
   * @type {string}
   */
  abstract version: string;

  /**
   * Plugin context
   * @protected
   * @type {PluginContext}
   */
  protected context!: PluginContext;

  /**
   * Sets up plugin
   * @param {PluginContext} context - Plugin context
   * @returns {Promise<void>}
   *
   * @throws {PluginError} When setup fails
   * @emits {PluginEvent} setup - When plugin is set up
   */
  async setup(context: PluginContext): Promise<void>;

  /**
   * Initializes plugin
   * @protected
   * @abstract
   * @returns {Promise<void>}
   */
  protected abstract initialize(): Promise<void>;

  /**
   * Loads schema
   * @abstract
   * @returns {Promise<Schema>}
   */
  abstract loadSchema(): Promise<Schema>;

  /**
   * Generates configuration
   * @abstract
   * @param {Schema} schema - Configuration schema
   * @param {unknown} options - Generation options
   * @returns {Promise<unknown>}
   */
  abstract generate(schema: Schema, options?: unknown): Promise<unknown>;
}
