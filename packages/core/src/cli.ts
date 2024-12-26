//// @ts-check
/**
 * @fileoverview CLI system implementation
 * @package @bitx-sh/config
 */

///// <reference types="typescript" />
///// <reference types="bun-types" />

import { defineCommand } from "citty";
import { consola } from "consola";
import type { Command, CommandMeta, CommandArgs } from "./types";

/**
 * CLI system class
 * @class CLI
 *
 * @description
 * Handles command-line interface interactions, command registration,
 * argument parsing, and execution flow.
 *
 * @example
 * ```typescript
 * const cli = new CLI();
 * await cli.run(process.argv.slice(2));
 * ```
 */
export class CLI {
  /**
   * Registered commands
   * @private
   * @type {Map<string, Command>}
   */
  private commands: Map<string, Command>;

  /**
   * Logger instance
   * @private
   * @type {typeof consola}
   */
  private logger: typeof consola;

  /**
   * Creates CLI instance
   * @constructor
   * @param {CLIOptions} options - CLI options
   */
  constructor(options?: CLIOptions);

  /**
   * Registers commands
   * @private
   * @returns {void}
   *
   * @throws {CommandError} When registration fails
   * @emits {CommandEvent} register - When command is registered
   */
  private registerCommands(): void;

  /**
   * Runs CLI command
   * @param {string[]} args - Command arguments
   * @returns {Promise<void>}
   *
   * @throws {CommandError} When execution fails
   * @emits {CommandEvent} execute - When command executes
   */
  async run(args: string[]): Promise<void>;

  /**
   * Parses command
   * @private
   * @param {string[]} args - Command arguments
   * @returns {Command | undefined}
   */
  private parseCommand(args: string[]): Command | undefined;

  /**
   * Shows help text
   * @private
   * @returns {void}
   */
  private showHelp(): void;

  /**
   * Handles errors
   * @private
   * @param {Error} error - Error instance
   * @returns {void}
   */
  private handleError(error: Error): void;
}

/**
 * CLI options interface
 * @interface CLIOptions
 */
export interface CLIOptions {
  /**
   * Logger instance
   * @type {typeof consola}
   */
  logger?: typeof consola;

  /**
   * Command directory
   * @type {string}
   */
  commandDir?: string;

  /**
   * Plugin directory
   * @type {string}
   */
  pluginDir?: string;
}

/**
 * Command definition helper
 * @function defineCommand
 *
 * @param {CommandDefinition} definition - Command definition
 * @returns {Command}
 *
 * @example
 * ```typescript
 * const command = defineCommand({
 *   meta: {
 *     name: 'init',
 *     description: 'Initialize configuration'
 *   },
 *   run: async (args) => {
 *     // Command implementation
 *   }
 * });
 * ```
 */
export function defineCommand(definition: CommandDefinition): Command;
