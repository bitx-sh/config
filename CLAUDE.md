# BitX Config Development Guide

## Build/Test Commands
- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test` (single test: `bun test path/to/test.ts`)
- Lint: `bun run lint` or `biome check .`
- Format: `bun run format` or `biome format . --write`
- Clean: `bun run clean`

## Code Style Guidelines
- **Formatting**: Biome with 2-space indentation, 80 char line width, single quotes
- **Imports**: Organized by Biome (auto-sorted by organizeImports)
- **Types**: TypeScript strict mode with explicit types and JSDoc documentation
- **Naming Conventions**:
  - Classes: PascalCase (e.g., `BasePlugin`)
  - Functions/variables: camelCase
  - Constants: UPPER_CASE
- **Documentation**: JSDoc with `@fileoverview`, `@package`, examples, and types
- **Error Handling**: Typed errors in function signatures with proper propagation
- **Architecture**: Monorepo with core package and plugins following BasePlugin

## Tech Stack
- **Runtime**: Bun (v1.1.40+)
- **Language**: TypeScript (v5.7.2+)
- **Formatting/Linting**: Biome (v1.9.4)
- **Core Libraries**: c12, citty, consola, zod, unbuild, unconfig
- **Testing**: Bun test runner
- **Plugins**: Various plugins (biome, github, renovate, vite)