import { createConsola } from 'consola'
import { loadConfig } from 'c12'
import { defineSchema, validateSchema } from './schema'
import { PluginSystem } from './plugins'
import type { BitXOptions, Schema, Config, Plugin } from './types'

export class BitXCore {
  private logger = createConsola()
  private plugins: PluginSystem
  private schemas = new Map<string, Schema>()
  private config: Config = {}

  constructor(options: BitXOptions = {}) {
    this.plugins = new PluginSystem(this)
    this.init(options)
  }

  private async init(options: BitXOptions) {
    // Load core configuration
    const { config } = await loadConfig({
      name: 'bitx',
      defaults: {
        plugins: {},
        schema: {
          validation: true,
          coerce: true
        }
      }
    })

    this.config = config

    // Initialize plugin system
    await this.initializePlugins()
  }

  private async initializePlugins() {
    const corePlugins = [
      '@bitx-sh/plugin-biome',
      '@bitx-sh/plugin-vite',
      '@bitx-sh/plugin-github',
      '@bitx-sh/plugin-renovate'
    ]

    for (const plugin of corePlugins) {
      try {
        await this.plugins.load(plugin)
      } catch (error) {
        this.logger.warn(`Failed to load plugin ${plugin}:`, error)
      }
    }
  }

  async schema.load(type: string): Promise<Schema> {
    // Check cache first
    if (this.schemas.has(type)) {
      return this.schemas.get(type)!
    }

    // Get plugin for type
    const plugin = this.plugins.get(type)
    if (!plugin) {
      throw new Error(`No plugin found for type: ${type}`)
    }

    // Load schema from plugin
    const schema = await plugin.loadSchema()

    // Validate schema
    await validateSchema(schema)

    // Cache schema
    this.schemas.set(type, schema)

    return schema
  }

  async generate(schema: Schema, options: any = {}): Promise<Config> {
    // Get plugin for schema
    const plugin = this.plugins.getForSchema(schema)
    if (!plugin) {
      throw new Error('No plugin found for schema')
    }

    // Generate configuration
    const config = await plugin.generate(schema, options)

    // Validate configuration
    await this.validate(config, schema)

    return config
  }

  async validate(config: unknown, schema: Schema): Promise<void> {
    const result = await validateSchema(config, schema)
    if (!result.success) {
      throw new Error(`Invalid configuration: ${result.error}`)
    }
  }

  async save(config: Config, path: string): Promise<void> {
    // Determine format from path
    const format = path.split('.').pop()

    // Transform if needed
    const transformed = await this.transform(config, format!)

    // Write to file
    await Bun.write(path, transformed)
  }

  async transform(config: Config, format: string): Promise<string> {
    switch (format) {
      case 'json':
        return JSON.stringify(config, null, 2)
      case 'ts':
        return `export default ${JSON.stringify(config, null, 2)}`
      case 'js':
        return `module.exports = ${JSON.stringify(config, null, 2)}`
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  }
}
