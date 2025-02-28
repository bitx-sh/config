//// @ts-check
/**
 * @fileoverview Core system implementation
 * @package @bitx-sh/config
 */

///// <reference types="typescript" />
///// <reference types="bun-types" />

import { createConsola } from 'consola';
import { loadConfig } from 'c12';
import { SchemaValidator } from './schema/validator';
import { PluginSystem } from './plugins';
import type { BitXOptions, Schema, Config, Plugin, PluginContext } from './types';

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
  constructor(options: BitXOptions = {}) {
    this.plugins = new PluginSystem();
    this.init(options).catch((error) => {
      this.logger.error('Initialization failed:', error);
      throw error;
    });
  }

  /**
   * Initializes core system
   * @private
   * @param {BitXOptions} options - Initialization options
   * @returns {Promise<void>}
   *
   * @throws {InitializationError} When initialization fails
   * @emits {CoreEvent} init - When system is initialized
   */
  private async init(options: BitXOptions): Promise<void> {
    this.logger.debug('Initializing BitX Config system');
    
    // Load user configuration
    const { config } = await loadConfig({
      name: 'bitx',
      defaults: {},
      ...options,
    });
    
    this.config = config || {};
    
    // Initialize plugins
    await this.initializePlugins();
    
    this.logger.success('BitX Config system initialized');
  }

  /**
   * Initializes plugins
   * @private
   * @returns {Promise<void>}
   */
  private async initializePlugins(): Promise<void> {
    this.logger.debug('Initializing plugins');
    
    // Load core plugins
    const pluginTypes = ['biome', 'github', 'renovate', 'vite'];
    
    for (const type of pluginTypes) {
      try {
        const pluginModule = await import(`@bitx-sh/plugin-${type}`);
        if (pluginModule?.default) {
          const PluginClass = pluginModule.default;
          const plugin = new PluginClass();
          await plugin.setup({
            core: this,
            logger: this.logger,
            registerTransformer: (name, transformer) => {
              // Register transformer implementation
              this.logger.debug(`Registered transformer: ${name}`);
            }
          });
          
          this.logger.debug(`Initialized plugin: ${plugin.name}`);
        }
      } catch (error) {
        this.logger.warn(`Failed to load plugin: ${type}`, error);
      }
    }
  }

  /**
   * Loads schema
   * @param {string} type - Schema type
   * @returns {Promise<Schema>}
   *
   * @throws {SchemaError} When schema loading fails
   * @emits {SchemaEvent} load - When schema is loaded
   */
  async loadSchema(type: string): Promise<Schema> {
    this.logger.debug(`Loading schema: ${type}`);
    
    // Check cache first
    if (this.schemas.has(type)) {
      return this.schemas.get(type)!;
    }
    
    // Find plugin that can handle this schema type
    const plugin = Array.from(this.plugins.registry.values())
      .find(p => p.name.includes(type) || p.name.endsWith(`-${type}`));
    
    if (!plugin) {
      throw new Error(`No plugin found for schema type: ${type}`);
    }
    
    try {
      const schema = await plugin.loadSchema();
      
      // Cache schema
      this.schemas.set(type, schema);
      
      return schema;
    } catch (error) {
      this.logger.error(`Failed to load schema: ${type}`, error);
      throw error;
    }
  }

  /**
   * Generates configuration
   * @param {Schema} schema - Configuration schema
   * @param {unknown} options - Generation options
   * @returns {Promise<Config>}
   *
   * @throws {GenerationError} When generation fails
   * @emits {ConfigEvent} generate - When configuration is generated
   */
  async generate(schema: Schema, options?: unknown): Promise<Config> {
    this.logger.debug('Generating configuration');
    
    // Find plugin that can handle this schema
    const plugin = Array.from(this.plugins.registry.values())
      .find(p => p.name.includes(schema.type) || p.name.endsWith(`-${schema.type}`));
    
    if (!plugin) {
      throw new Error(`No plugin found for schema type: ${schema.type}`);
    }
    
    try {
      const config = await plugin.generate(schema, options);
      return config as Config;
    } catch (error) {
      this.logger.error('Configuration generation failed', error);
      throw error;
    }
  }

  /**
   * Validates configuration
   * @param {unknown} config - Configuration to validate
   * @param {Schema} schema - Validation schema
   * @returns {Promise<void>}
   *
   * @throws {ValidationError} When validation fails
   * @emits {ValidationEvent} validate - When validation completes
   */
  async validate(config: unknown, schema: Schema): Promise<void> {
    this.logger.debug('Validating configuration');
    
    // Create validator instance
    const validator = new SchemaValidator();
    
    try {
      const result = await validator.validate(config, schema);
      
      if (!result.success) {
        throw new Error(
          `Validation failed:\n${result.errors
            .map(e => `- ${e.path.join('.')}: ${e.message}`)
            .join('\n')}`
        );
      }
    } catch (error) {
      this.logger.error('Validation failed', error);
      throw error;
    }
  }

  /**
   * Saves configuration
   * @param {Config} config - Configuration to save
   * @param {string} path - Output path
   * @returns {Promise<void>}
   *
   * @throws {SaveError} When saving fails
   * @emits {ConfigEvent} save - When configuration is saved
   */
  async save(config: Config, path: string): Promise<void> {
    this.logger.debug(`Saving configuration to: ${path}`);
    
    try {
      // Determine format from file extension
      const format = path.split('.').pop() || 'json';
      
      // Transform config to the right format
      const content = await this.transform(config, format);
      
      // Write to file
      await Bun.write(path, content);
      
      this.logger.success(`Configuration saved to: ${path}`);
    } catch (error) {
      this.logger.error(`Failed to save configuration to: ${path}`, error);
      throw error;
    }
  }

  /**
   * Transforms configuration
   * @param {Config} config - Configuration to transform
   * @param {string} format - Target format
   * @returns {Promise<string>}
   *
   * @throws {TransformError} When transformation fails
   * @emits {ConfigEvent} transform - When configuration is transformed
   */
  async transform(config: Config, format: string): Promise<string> {
    this.logger.debug(`Transforming configuration to: ${format}`);
    
    try {
      switch (format.toLowerCase()) {
        case 'json':
          return JSON.stringify(config, null, 2);
          
        case 'js':
        case 'ts':
          const isTs = format === 'ts';
          return `${isTs ? '// @ts-check\n' : ''}export default ${JSON.stringify(config, null, 2)};`;
          
        case 'yaml':
        case 'yml':
          // Simple YAML transformation
          const yamlLines = [];
          
          const formatYaml = (obj: Record<string, any>, indent = 0) => {
            const spaces = ' '.repeat(indent);
            
            for (const [key, value] of Object.entries(obj)) {
              if (typeof value === 'object' && value !== null) {
                yamlLines.push(`${spaces}${key}:`);
                formatYaml(value, indent + 2);
              } else {
                yamlLines.push(`${spaces}${key}: ${JSON.stringify(value)}`);
              }
            }
          };
          
          formatYaml(config);
          return yamlLines.join('\n');
          
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      this.logger.error(`Failed to transform configuration to: ${format}`, error);
      throw error;
    }
  }
}
