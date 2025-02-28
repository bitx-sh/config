//// @ts-check
/**
 * @fileoverview CLI system implementation
 * @package @bitx/config
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
  constructor(options?: CLIOptions) {
    this.commands = new Map();
    this.logger = options?.logger || consola;
    
    this.registerCommands();
  }

  /**
   * Registers commands
   * @private
   * @returns {void}
   *
   * @throws {CommandError} When registration fails
   * @emits {CommandEvent} register - When command is registered
   */
  private registerCommands(): void {
    // Register default commands
    const defaultCommands = {
      init: defineCommand({
        meta: {
          name: "init",
          description: "Initialize a new configuration",
        },
        args: {
          type: {
            type: "positional",
            description: "Configuration type (biome, renovate, github, vite)",
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
            default: "json",
          },
        },
        async run({ args }) {
          // Command implementation will be added later
          this.logger.info(`Initializing ${args.type} configuration...`);
        },
      }),
      
      help: defineCommand({
        meta: {
          name: "help",
          description: "Show help information",
        },
        args: {
          command: {
            type: "positional",
            description: "Command name",
            required: false,
          },
        },
        async run({ args }) {
          if (args.command && this.commands.has(args.command as string)) {
            const cmd = this.commands.get(args.command as string)!;
            this.showCommandHelp(cmd);
          } else {
            this.showHelp();
          }
        },
      }),
    };
    
    // Register commands
    for (const [name, command] of Object.entries(defaultCommands)) {
      this.commands.set(name, command);
    }
  }

  /**
   * Runs CLI command
   * @param {string[]} args - Command arguments
   * @returns {Promise<void>}
   *
   * @throws {CommandError} When execution fails
   * @emits {CommandEvent} execute - When command executes
   */
  async run(args: string[]): Promise<void> {
    try {
      // Show help if no arguments
      if (args.length === 0) {
        this.showHelp();
        return;
      }
      
      // Parse command
      const commandName = args[0];
      
      if (!this.commands.has(commandName)) {
        this.logger.error(`Unknown command: ${commandName}`);
        this.showHelp();
        return;
      }
      
      const command = this.commands.get(commandName)!;
      const parsedArgs = this.parseArgs(args.slice(1), command);
      
      // Check required args
      if (command.args) {
        for (const [name, arg] of Object.entries(command.args)) {
          if (arg.required && parsedArgs[name] === undefined) {
            this.logger.error(`Missing required argument: ${name}`);
            this.showCommandHelp(command);
            return;
          }
        }
      }
      
      // Execute command
      await command.run({
        args: parsedArgs,
        logger: this.logger,
      });
      
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * Parses arguments
   * @private
   * @param {string[]} args - Command arguments
   * @param {Command} command - Command
   * @returns {Record<string, unknown>}
   */
  private parseArgs(args: string[], command: Command): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    
    // Set default values
    if (command.args) {
      for (const [name, arg] of Object.entries(command.args)) {
        if (arg.default !== undefined) {
          result[name] = arg.default;
        }
      }
    }
    
    // Parse positional args
    let positionalIndex = 0;
    const positionalArgs = command.args ? 
      Object.entries(command.args)
        .filter(([, arg]) => arg.type === 'positional')
        .map(([name]) => name) 
      : [];
    
    let i = 0;
    while (i < args.length) {
      const arg = args[i];
      
      // Option
      if (arg.startsWith('-')) {
        const isLong = arg.startsWith('--');
        const name = isLong ? arg.slice(2) : arg.slice(1);
        
        // Find option
        const option = command.args ? 
          Object.entries(command.args)
            .find(([, a]) => a.type === 'option' && 
              (isLong ? a.name === name : a.alias === name))
          : undefined;
        
        if (option) {
          const [optName, optConfig] = option;
          
          // Boolean option
          if (i + 1 >= args.length || args[i + 1].startsWith('-')) {
            result[optName] = true;
          } else {
            // Value option
            result[optName] = args[i + 1];
            i++;
          }
        }
      } 
      // Positional argument
      else if (positionalIndex < positionalArgs.length) {
        result[positionalArgs[positionalIndex]] = arg;
        positionalIndex++;
      }
      
      i++;
    }
    
    return result;
  }

  /**
   * Shows command help
   * @private
   * @param {Command} command - Command
   * @returns {void}
   */
  private showCommandHelp(command: Command): void {
    this.logger.info(`\n${command.meta.name} - ${command.meta.description}`);
    
    if (command.args) {
      this.logger.info('\nArguments:');
      
      for (const [name, arg] of Object.entries(command.args)) {
        const argName = arg.type === 'option' ? 
          `--${name}${arg.alias ? `, -${arg.alias}` : ''}` : 
          name;
        
        const required = arg.required ? ' (required)' : '';
        const defaultValue = arg.default !== undefined ? 
          ` (default: ${arg.default})` : '';
        
        this.logger.info(`  ${argName}${required}${defaultValue}`);
        this.logger.info(`    ${arg.description}`);
      }
    }
    
    this.logger.info('');
  }

  /**
   * Shows help text
   * @private
   * @returns {void}
   */
  private showHelp(): void {
    this.logger.info('\nBitX Config - Configuration management system');
    this.logger.info('\nUsage: bitx-config <command> [options]');
    
    this.logger.info('\nCommands:');
    for (const [name, command] of this.commands.entries()) {
      this.logger.info(`  ${name.padEnd(10)} ${command.meta.description}`);
    }
    
    this.logger.info('\nUse bitx-config help <command> for more information about a command.\n');
  }

  /**
   * Handles errors
   * @private
   * @param {Error} error - Error instance
   * @returns {void}
   */
  private handleError(error: Error): void {
    this.logger.error('Error:', error.message);
    if (process.env.DEBUG) {
      this.logger.error(error.stack);
    }
  }
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
export function defineCommand(definition: CommandDefinition): Command {
  return definition as Command;
}

/**
 * Creates CLI instance
 * @function createCLI
 * @returns {CLI}
 * 
 * @example
 * ```typescript
 * const cli = createCLI();
 * await cli.run(process.argv.slice(2));
 * ```
 */
export function createCLI(options?: CLIOptions): CLI {
  return new CLI(options);
}

// Only run if this is the main module (for direct execution)
if (import.meta.url === Bun?.main || process.argv[1] === import.meta.url) {
  const cli = createCLI();
  cli.run(process.argv.slice(2)).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
