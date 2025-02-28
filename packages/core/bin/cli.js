#!/usr/bin/env node

/**
 * @fileoverview Binary entry point for @bitx/config CLI
 * @package @bitx/config
 */

import { createCLI } from '../dist/index.js';

// Create and run CLI
const cli = createCLI();
cli.run(process.argv.slice(2)).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});