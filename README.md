# 🐰 bitx-config

[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)
[![CI](https://img.shields.io/github/actions/workflow/status/bitx-sh/config/ci.yml?branch=main&style=for-the-badge)](https://github.com/bitx-sh/config/actions)

Universal configuration loader and generator with an extensible plugin system, powered by Bun.

## 🎯 Features

- 🚀 Blazingly fast configuration loading with Bun
- 🔌 Extensible plugin system
- 🎨 Schema-based configuration generation
- 🔄 Multi-source configuration merging
- 🤖 AI-friendly architecture
- 📦 Built-in support for popular tools (Biome, Vite, GitHub Actions, Renovate)
- 🔒 Type-safe configuration with Zod
- 🎭 Interactive configuration prompts
- 📚 Automatic documentation generation

## 🚀 Quick Start

```bash
# Install globally with bun
bun install -g @bitx-sh/config

# Initialize a new configuration
bitx-config init -t biome -o biome.config.ts

# Or run directly with bunx
bunx @bitx-sh/config init -t biome -o biome.config.ts
```

## 🤖 AI Agent Guide

> [!IMPORTANT]
> This section is specifically structured for AI language models, particularly Claude 3.5 Sonnet.

### System Prompt

You are a Configuration Generator Agent specialized in creating and managing configuration files using the bitx-config tool. Your core purpose is to help users generate, validate, and maintain configuration files for various tools and frameworks.

Primary capabilities:
1. Schema analysis and validation
2. Interactive configuration generation
3. Multi-source configuration merging
4. Plugin-based extensibility
5. Type-safe configuration management

### Knowledge Context

```typescript
interface BitXContext {
  // Core configuration context
  config: {
    schema: Schema;
    values: Record<string, unknown>;
    sources: ConfigSource[];
  };

  // Plugin system
  plugins: Map<string, BitXPlugin>;

  // Schema management
  schemas: {
    load(source: string): Promise<Schema>;
    validate(config: unknown): Promise<boolean>;
    generate(schema: Schema): Promise<string>;
  };

  // User interaction
  prompt: {
    ask(question: string): Promise<string>;
    select(options: string[]): Promise<string>;
    confirm(message: string): Promise<boolean>;
  };
}

interface BitXPlugin {
  name: string;
  type: 'schema' | 'loader' | 'transformer' | 'output';
  setup: (ctx: BitXContext) => Promise<void>;
  hooks?: Partial<BitXHooks>;
}
```

### Interaction Guidelines

1. Always validate input schemas before processing
2. Use type-safe operations with Zod schemas
3. Follow the plugin system architecture
4. Maintain configuration source priority
5. Generate comprehensive documentation

### Command Structure

```yaml
commands:
  init:
    description: Initialize new configuration
    options:
      - name: type (-t)
        description: Configuration type
      - name: output (-o)
        description: Output file path
  get:
    description: Retrieve configuration value
  set:
    description: Set configuration value
  list:
    description: List all configurations
  import:
    description: Import configuration
  export:
    description: Export configuration
```

### Plugin Development Guide

```typescript
// Example plugin implementation
import type { BitXPlugin, BitXContext } from '@bitx-sh/config';

export default function createPlugin(): BitXPlugin {
  return {
    name: 'my-plugin',
    type: 'schema',
    async setup(ctx: BitXContext) {
      // Plugin setup logic
    },
    hooks: {
      beforeLoad: async (config) => {
        // Pre-load hook
        return config;
      },
      afterLoad: async (config) => {
        // Post-load hook
        return config;
      }
    }
  };
}
```

## 🗺️ Project Roadmap

### Phase 1: Core Framework (Current)
- [x] Basic project structure
- [x] Plugin system architecture
- [x] Configuration loading
- [ ] Schema validation
- [ ] Interactive prompts

### Phase 2: Initial Plugins
- [ ] Biome configuration plugin
- [ ] Vite configuration plugin
- [ ] GitHub Actions plugin
- [ ] Renovate configuration plugin

### Phase 3: Advanced Features
- [ ] Remote schema loading
- [ ] Schema conversion
- [ ] Configuration merging
- [ ] Documentation generation

### Phase 4: Ecosystem Expansion
- [ ] Additional plugin support
- [ ] IDE integration
- [ ] CI/CD integration
- [ ] Configuration sharing

## 🧩 Plugin System

### Core Plugins

```typescript
// Available plugins
type AvailablePlugins =
  | '@bitx-sh/plugin-biome'
  | '@bitx-sh/plugin-vite'
  | '@bitx-sh/plugin-github'
  | '@bitx-sh/plugin-renovate';

// Plugin registration
interface PluginRegistration {
  name: string;
  source: string | (() => Promise<BitXPlugin>);
  options?: Record<string, unknown>;
}
```

### Creating Custom Plugins

```typescript
import { definePlugin } from '@bitx-sh/config';

export default definePlugin({
  name: 'custom-plugin',
  type: 'schema',
  setup: async (ctx) => {
    // Plugin setup logic
  }
});
```

## 📘 API Reference

### Core API

```typescript
import { defineConfig } from '@bitx-sh/config';

export default defineConfig({
  // Configuration options
  plugins: ['@bitx-sh/plugin-biome'],
  schema: './schema.json',
  output: {
    format: 'ts',
    path: './config.ts'
  }
});
```

### Plugin API

```typescript
import { definePlugin, type BitXPlugin } from '@bitx-sh/config';

export interface PluginOptions {
  // Plugin-specific options
}

export default definePlugin<PluginOptions>((options) => {
  return {
    name: 'plugin-name',
    // Plugin implementation
  };
});
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Daniel Bodnar](https://github.com/danielbodnar)

---

<details>
<summary>🤖 AI Agent Configuration</summary>

```yaml
model: claude-3-5-sonnet-20241022
temperature: 0
max_tokens: 8192
system_context: Configuration Generator Agent
primary_goal: Generate and manage configuration files
capabilities:
  - Schema validation
  - Configuration generation
  - Plugin management
  - Documentation generation
```

</details>
