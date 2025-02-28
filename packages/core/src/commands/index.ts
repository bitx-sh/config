//// @ts-check
/**
 * @fileoverview CLI command implementations
 * @package @bitx-sh/config
 */

///// <reference types="typescript" />
///// <reference types="bun-types" />

import { defineCommand } from "../cli";
import { consola } from "consola";
import type { BitXCore } from "../types";

/**
 * Creates command set
 * @function createCommands
 *
 * @param {BitXCore} core - Core instance
 * @returns {Record<string, Command>}
 *
 * @example
 * ```typescript
 * const commands = createCommands(core);
 * cli.registerCommands(commands);
 * ```
 */
export const createCommands = (core: BitXCore) => ({
  /**
   * Initialize command
   * @type {Command}
   */
  init: defineCommand({
    meta: {
      name: "init",
      description: "Initialize a new configuration",
    },
    args: {
      type: {
        type: "positional",
        description: "Configuration type",
        required: true,
      },
      output: {
        type: "option",
        alias: "o",
        description: "Output file path",
      },
      format: {
        type: "option",
        alias: "f",
        description: "Output format (ts, js, json, yaml)",
        default: "ts",
      },
    },
    async run({ args }) {
      // Command implementation
    },
  }),

  /**
   * Get command
   * @type {Command}
   */
  get: defineCommand({
    meta: {
      name: "get",
      description: "Get configuration value",
    },
    args: {
      key: {
        type: "positional",
        description: "Configuration key",
        required: true,
      },
    },
    async run({ args }) {
      // Command implementation
    },
  }),

  /**
   * Set command
   * @type {Command}
   */
  set: defineCommand({
    meta: {
      name: "set",
      description: "Set configuration value",
    },
    args: {
      key: {
        type: "positional",
        description: "Configuration key",
        required: true,
      },
      value: {
        type: "positional",
        description: "Configuration value",
        required: true,
      },
    },
    async run({ args }) {
      // Command implementation
    },
  }),
});

/**
 * Command interface
 * @interface Command
 */
export interface Command {
  /**
   * Command metadata
   * @type {CommandMeta}
   */
  meta: CommandMeta;

  /**
   * Command arguments
   * @type {Record<string, CommandArg>}
   */
  args?: Record<string, CommandArg>;

  /**
   * Executes command
   * @param {CommandContext} context - Command context
   * @returns {Promise<void>}
   *
   * @throws {CommandError} When execution fails
   * @emits {CommandEvent} execute - When command executes
   */
  run(context: CommandContext): Promise<void>;
}

/**
 * Command argument interface
 * @interface CommandArg
 */
export interface CommandArg {
  /**
   * Argument type
   * @type {'positional' | 'option'}
   */
  type: 'positional' | 'option';

  /**
   * Argument description
   * @type {string}
   */
  description: string;

  /**
   * Required flag
   * @type {boolean}
   */
  required?: boolean;

  /**
   * Argument alias
   * @type {string}
   */
  alias?: string;

  /**
   * Default value
   * @type {unknown}
   */
  default?: unknown;
}

/**
 * Command context interface
 * @interface CommandContext
 */
export interface CommandContext {
  /**
   * Command arguments
   * @type {Record<string, unknown>}
   */
  args: Record<string, unknown>;

  /**
   * Core instance
   * @type {BitXCore}
   */
  core: BitXCore;

  /**
   * Logger instance
   * @type {typeof consola}
   */
  logger: typeof consola;
}
