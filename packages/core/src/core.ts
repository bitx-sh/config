//// @ts-check
/**
 * @fileoverview Core system implementation
 * @package @bitx-sh/config
 */

///// <reference types="typescript" />
///// <reference types="bun-types" />

import { createConsola } from 'consola';
import { loadConfig } from 'c12';
import { defineSchema, validateSchema } from './schema';
import { PluginSystem } from './plugins';
import type { BitXOptions, Schema, Config, Plugin } from './types';

/**
 * Core system class
 * @class BitXCore
 *
 * @description
 * Main entry point for the BitX Config system.
 * Manages all subsystems and coordinates operations.
 *
 * @example
 * ```typescript
 * const core = new BitXCore();
 * await core.init();
 * const config = await core.loadConfig('biome');
 * ```
 */
export class BitXCore {
  /**
   * Logger instance
   * @private
   * @type {ReturnType<typeof createConsola>}
   */
  private logger = createConsola();

  /**
   * Plugin system
   * @private
   * @type {PluginSystem}
   */
  private plugins: PluginSystem;

  /**
   * Schema cache
   * @private
   * @type {Map<string, Schema>}
   */
  private schemas = new Map<string, Schema>();

  /**
   * Configuration
   * @private
   * @type {Config}
   */
  private config: Config = {};

  /**
   * Creates core system
   * @constructor
   * @param {BitXOptions} options - Initialization options
   */
  constructor(options: BitXOptions = {});

  /**
   * Initializes core system
   * @private
   * @param {BitXOptions} options - Initialization options
   * @returns {Promise<void>}
   *
   * @throws {InitializationError} When initialization fails
   * @emits {CoreEvent} init - When system is initialized
   */
  private async init(options: BitXOptions): Promise<void>;

  /**
   * Initializes plugins
   * @private
   * @returns {Promise<void>}
   */
  private async initializePlugins(): Promise<void>;

  /**
   * Loads schema
   * @param {string} type - Schema type
   * @returns {Promise<Schema>}
   *
   * @throws {SchemaError} When schema loading fails
   * @emits {SchemaEvent} load - When schema is loaded
   */
  async loadSchema(type: string): Promise<Schema>;

  /**
   * Generates configuration
   * @param {Schema} schema - Configuration schema
   * @param {unknown} options - Generation options
   * @returns {Promise<Config>}
   *
   * @throws {GenerationError} When generation fails
   * @emits {ConfigEvent} generate - When configuration is generated
   */
  async generate(schema: Schema, options?: unknown): Promise<Config>;

  /**
   * Validates configuration
   * @param {unknown} config - Configuration to validate
   * @param {Schema} schema - Validation schema
   * @returns {Promise<void>}
   *
   * @throws {ValidationError} When validation fails
   * @emits {ValidationEvent} validate - When validation completes
   */
  async validate(config: unknown, schema: Schema): Promise<void>;

  /**
   * Saves configuration
   * @param {Config} config - Configuration to save
   * @param {string} path - Output path
   * @returns {Promise<void>}
   *
   * @throws {SaveError} When saving fails
   * @emits {ConfigEvent} save - When configuration is saved
   */
  async save(config: Config, path: string): Promise<void>;

  /**
   * Transforms configuration
   * @param {Config} config - Configuration to transform
   * @param {string} format - Target format
   * @returns {Promise<string>}
   *
   * @throws {TransformError} When transformation fails
   * @emits {ConfigEvent} transform - When configuration is transformed
   */
  async transform(config: Config, format: string): Promise<string>;
}
