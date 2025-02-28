/**
 * @fileoverview Main entry point for BitX Config
 * @package @bitx-sh/config
 */

export { BitXCore } from './packages/core/src/core';
export { BasePlugin } from './packages/core/src/plugins/base';
export * from './packages/core/src/types';

// Re-export plugins
import BiomePlugin from './packages/plugin-biome/src';
import GithubPlugin from './packages/plugin-github/src';
import VitePlugin from './packages/plugin-vite/src';
import RenovatePlugin from './packages/plugin-renovate/src';

export const plugins = {
  BiomePlugin,
  GithubPlugin,
  VitePlugin,
  RenovatePlugin,
};

// Main CLI entrypoint
if (import.meta.main) {
  const { createCLI } = await import('./packages/core/src/cli');
  const cli = createCLI();
  
  try {
    await cli.run(process.argv.slice(2));
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}
