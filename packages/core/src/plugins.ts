//// @ts-check
/**
 * @fileoverview Plugin system implementation
 * @package @bitx-sh/config
 */

///// <reference types="typescript" />
///// <reference types="bun-types" />

import { Plugin, PluginContext, Hook, Schema } from "./types";
import { createConsola } from "consola";

/**
 * Plugin system class
 * @class PluginSystem
 *
 * @description
 * Manages plugin lifecycle, registration, and hooks system.
 * Provides a central registry for all plugins.
 *
 * @example
 * ```typescript
 * const plugins = new PluginSystem();
 * await plugins.register(myPlugin);
 * ```
 */
export class PluginSystem {
  /**
   * Plugin registry
   * @public
   * @type {Map<string, Plugin>}
   */
  registry = new Map<string, Plugin>();

  /**
   * Plugin hooks
   * @public
   * @type {Map<string, Set<Hook>>}
   */
  hooks = new Map<string, Set<Hook>>();

  /**
   * Logger instance
   * @private
   * @type {ReturnType<typeof createConsola>}
   */
  private logger = createConsola();

  /**
   * Registers plugin
   * @param {Plugin} plugin - Plugin to register
   * @returns {Promise<void>}
   *
   * @throws {PluginError} When registration fails
   * @emits {PluginEvent} register - When plugin is registered
   */
  async register(plugin: Plugin): Promise<void> {
    if (!plugin.name) {
      throw new Error("Plugin must have a name");
    }

    if (this.registry.has(plugin.name)) {
      throw new Error(`Plugin '${plugin.name}' is already registered`);
    }

    this.logger.debug(`Registering plugin: ${plugin.name}`);
    
    // Store plugin
    this.registry.set(plugin.name, plugin);
    
    // Register hooks
    if (plugin.hooks) {
      for (const [hookName, hookFn] of Object.entries(plugin.hooks)) {
        this.addHook(hookName, hookFn);
      }
    }
    
    this.logger.success(`Plugin registered: ${plugin.name}`);
  }

  /**
   * Unregisters plugin
   * @param {string} name - Plugin name
   * @returns {Promise<void>}
   *
   * @throws {PluginError} When unregistration fails
   * @emits {PluginEvent} unregister - When plugin is unregistered
   */
  async unregister(name: string): Promise<void> {
    if (!this.registry.has(name)) {
      throw new Error(`Plugin '${name}' is not registered`);
    }

    const plugin = this.registry.get(name)!;

    // Unregister hooks
    if (plugin.hooks) {
      for (const [hookName, hookFn] of Object.entries(plugin.hooks)) {
        this.removeHook(hookName, hookFn);
      }
    }

    // Remove plugin
    this.registry.delete(name);
    
    this.logger.success(`Plugin unregistered: ${name}`);
  }

  /**
   * Calls hook
   * @param {string} name - Hook name
   * @param {unknown} context - Hook context
   * @returns {Promise<void>}
   *
   * @throws {HookError} When hook execution fails
   * @emits {HookEvent} call - When hook is called
   */
  async callHook(name: string, context?: unknown): Promise<void> {
    if (!this.hooks.has(name)) {
      return;
    }

    const hooks = this.hooks.get(name)!;
    
    for (const hook of hooks) {
      try {
        await hook(context);
      } catch (error) {
        this.logger.error(`Error in hook '${name}':`, error);
        throw error;
      }
    }
  }

  /**
   * Adds hook
   * @param {string} name - Hook name
   * @param {Hook} hook - Hook function
   * @returns {void}
   */
  addHook(name: string, hook: Hook): void {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, new Set());
    }

    this.hooks.get(name)!.add(hook);
  }

  /**
   * Removes hook
   * @param {string} name - Hook name
   * @param {Hook} hook - Hook function
   * @returns {void}
   */
  removeHook(name: string, hook: Hook): void {
    if (!this.hooks.has(name)) {
      return;
    }

    this.hooks.get(name)!.delete(hook);
    
    // Clean up empty hook sets
    if (this.hooks.get(name)!.size === 0) {
      this.hooks.delete(name);
    }
  }

  /**
   * Lists plugins
   * @returns {Plugin[]}
   */
  listPlugins(): Plugin[] {
    return Array.from(this.registry.values());
  }
  
  /**
   * Gets plugin for schema
   * @param {Schema} schema - Schema
   * @returns {Plugin | undefined}
   */
  getForSchema(schema: Schema): Plugin | undefined {
    return Array.from(this.registry.values()).find((plugin) =>
      plugin.name.includes(schema.type) || plugin.name.endsWith(`-${schema.type}`)
    );
  }
}
