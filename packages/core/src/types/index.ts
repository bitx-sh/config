//// @ts-check
/**
 * @fileoverview Core type definitions for the BitX Config system
 * @package @bitx-sh/config
 */

///// <reference types="typescript" />
///// <reference types="bun-types" />

/**
 * Core system interface
 * @interface BitXCore
 *
 * @description
 * Main entry point for the BitX Config system. Manages schema validation,
 * configuration loading, plugin system, and user interface components.
 *
 * @example
 * ```typescript
 * const core = new BitXCore();
 * await core.init();
 * const config = await core.loadConfig('biome');
 * ```
 */
export interface BitXCore {
  /**
   * Schema management system
   * @type {SchemaSystem}
   */
  schema: SchemaSystem;

  /**
   * Configuration management system
   * @type {ConfigSystem}
   */
  config: ConfigSystem;

  /**
   * Plugin management system
   * @type {PluginSystem}
   */
  plugins: PluginSystem;

  /**
   * User interface system
   * @type {UISystem}
   */
  ui: UISystem;

  /**
   * Initializes the core system
   * @param {BitXOptions} options - Initialization options
   * @returns {Promise<void>}
   *
   * @throws {InitializationError} When initialization fails
   * @emits {InitEvent} init - When initialization completes
   */
  init(options?: BitXOptions): Promise<void>;

  /**
   * Loads a configuration schema
   * @param {string} type - Schema type identifier
   * @returns {Promise<Schema>}
   *
   * @throws {SchemaLoadError} When schema cannot be loaded
   * @emits {SchemaEvent} schema - When schema is loaded
   */
  loadSchema(type: string): Promise<Schema>;

  /**
   * Generates configuration from schema
   * @param {Schema} schema - Configuration schema
   * @param {GenerateOptions} options - Generation options
   * @returns {Promise<Config>}
   *
   * @throws {GenerationError} When generation fails
   * @emits {ConfigEvent} config - When configuration is generated
   */
  generate(schema: Schema, options?: GenerateOptions): Promise<Config>;
}

/**
 * Schema system interface
 * @interface SchemaSystem
 */
export interface SchemaSystem {
  /**
   * Registered schema definitions
   * @type {Map<string, Schema>}
   */
  definitions: Map<string, Schema>;

  /**
   * Schema validators
   * @type {Map<string, SchemaValidator>}
   */
  validators: Map<string, SchemaValidator>;

  /**
   * Schema transformers
   * @type {Map<string, SchemaTransformer>}
   */
  transformers: Map<string, SchemaTransformer>;

  /**
   * Registers a new schema
   * @param {Schema} schema - Schema to register
   * @returns {void}
   *
   * @throws {ValidationError} When schema is invalid
   * @emits {SchemaEvent} register - When schema is registered
   */
  register(schema: Schema): void;

  /**
   * Validates data against a schema
   * @param {unknown} data - Data to validate
   * @param {string} schemaName - Schema identifier
   * @returns {Promise<boolean>}
   *
   * @throws {ValidationError} When validation fails
   * @emits {ValidationEvent} validate - When validation completes
   */
  validate(data: unknown, schemaName: string): Promise<boolean>;
}

/**
 * Configuration system interface
 * @interface ConfigSystem
 */
export interface ConfigSystem {
  /**
   * Configuration sources
   * @type {ConfigSource[]}
   */
  sources: ConfigSource[];

  /**
   * Configuration values
   * @type {Map<string, any>}
   */
  values: Map<string, any>;

  /**
   * Configuration schemas
   * @type {Map<string, Schema>}
   */
  schemas: Map<string, Schema>;

  /**
   * Loads configuration from source
   * @param {ConfigSource} source - Configuration source
   * @returns {Promise<void>}
   *
   * @throws {LoadError} When loading fails
   * @emits {ConfigEvent} load - When configuration is loaded
   */
  load(source: ConfigSource): Promise<void>;

  /**
   * Merges configuration values
   * @param {Record<string, any>} values - Values to merge
   * @returns {void}
   *
   * @throws {MergeError} When merge fails
   * @emits {ConfigEvent} merge - When configuration is merged
   */
  merge(values: Record<string, any>): void;
}

/**
 * Plugin system interface
 * @interface PluginSystem
 */
export interface PluginSystem {
  /**
   * Plugin registry
   * @type {Map<string, Plugin>}
   */
  registry: Map<string, Plugin>;

  /**
   * Plugin hooks
   * @type {Map<string, Set<Hook>>}
   */
  hooks: Map<string, Set<Hook>>;

  /**
   * Registers a new plugin
   * @param {Plugin} plugin - Plugin to register
   * @returns {void}
   *
   * @throws {PluginError} When registration fails
   * @emits {PluginEvent} register - When plugin is registered
   */
  register(plugin: Plugin): void;

  /**
   * Unregisters a plugin
   * @param {string} name - Plugin name
   * @returns {void}
   *
   * @throws {PluginError} When unregistration fails
   * @emits {PluginEvent} unregister - When plugin is unregistered
   */
  unregister(name: string): void;
}

/**
 * User interface system interface
 * @interface UISystem
 */
export interface UISystem {
  /**
   * Command-line interface
   * @type {CLI}
   */
  cli: CLI;

  /**
   * Terminal user interface
   * @type {TUI}
   */
  tui: TUI;

  /**
   * Logger instance
   * @type {Logger}
   */
  logger: Logger;

  /**
   * Prompt system
   * @type {Prompt}
   */
  prompt: Prompt;
}

/**
 * Configuration source interface
 * @interface ConfigSource
 */
export interface ConfigSource {
  /**
   * Source type
   * @type {string}
   */
  type: string;

  /**
   * Source prefix
   * @type {string}
   */
  prefix?: string;

  /**
   * File patterns
   * @type {string[]}
   */
  patterns?: string[];

  /**
   * Default values
   * @type {Record<string, unknown>}
   */
  defaults?: Record<string, unknown>;
}

/**
 * Plugin interface
 * @interface Plugin
 */
export interface Plugin {
  /**
   * Plugin name
   * @type {string}
   */
  name: string;

  /**
   * Plugin version
   * @type {string}
   */
  version: string;

  /**
   * Plugin type
   * @type {PluginType}
   */
  type: PluginType;

  /**
   * Sets up the plugin
   * @param {PluginContext} context - Plugin context
   * @returns {Promise<void>}
   *
   * @throws {PluginError} When setup fails
   * @emits {PluginEvent} setup - When plugin is set up
   */
  setup(context: PluginContext): Promise<void>;

  /**
   * Plugin hooks
   * @type {Record<string, Hook>}
   */
  hooks?: Record<string, Hook>;

  /**
   * Plugin schema
   * @type {SchemaDefinition}
   */
  schema?: SchemaDefinition;

  /**
   * Plugin defaults
   * @type {Record<string, unknown>}
   */
  defaults?: Record<string, unknown>;
}

/**
 * Schema interface
 * @interface Schema
 */
export interface Schema {
  /**
   * Schema type
   * @type {string}
   */
  type: string;

  /**
   * Schema properties
   * @type {Record<string, SchemaProperty>}
   */
  properties?: Record<string, SchemaProperty>;

  /**
   * Required properties
   * @type {string[]}
   */
  required?: string[];

  /**
   * Schema definitions
   * @type {Record<string, Schema>}
   */
  definitions?: Record<string, Schema>;
}

/**
 * Schema property interface
 * @interface SchemaProperty
 */
export interface SchemaProperty {
  /**
   * Property type
   * @type {string}
   */
  type: string;

  /**
   * Property description
   * @type {string}
   */
  description?: string;

  /**
   * Default value
   * @type {unknown}
   */
  default?: unknown;

  /**
   * Enumerated values
   * @type {unknown[]}
   */
  enum?: unknown[];
}

/**
 * Plugin type enumeration
 * @enum {string}
 */
export type PluginType = 'schema' | 'loader' | 'transformer' | 'output';

/**
 * Hook function type
 * @type {Function}
 */
export type Hook = (context: unknown) => Promise<void>;

/**
 * Validation result interface
 * @interface ValidationResult
 */
export interface ValidationResult {
  /**
   * Validation success flag
   * @type {boolean}
   */
  success: boolean;

  /**
   * Validation errors
   * @type {ValidationError[]}
   */
  errors: ValidationError[];

  /**
   * Validated data
   * @type {unknown}
   */
  data?: unknown;
}

/**
 * Validation error interface
 * @interface ValidationError
 */
export interface ValidationError {
  /**
   * Error path
   * @type {string[]}
   */
  path: string[];

  /**
   * Error message
   * @type {string}
   */
  message: string;
}

/**
 * BitX options interface
 * @interface BitXOptions
 */
export interface BitXOptions {
  /**
   * UI options
   * @type {UIOptions}
   */
  ui?: UIOptions;

  /**
   * Plugin options
   * @type {PluginOptions}
   */
  plugins?: PluginOptions;

  /**
   * Schema options
   * @type {SchemaOptions}
   */
  schema?: SchemaOptions;
}

/**
 * Generation options interface
 * @interface GenerateOptions
 */
export interface GenerateOptions {
  /**
   * Output format
   * @type {string}
   */
  format?: string;

  /**
   * Output path
   * @type {string}
   */
  path?: string;

  /**
   * Generation flags
   * @type {Record<string, boolean>}
   */
  flags?: Record<string, boolean>;
}
