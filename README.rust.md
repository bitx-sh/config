# BitX Config CLI

<div align="center">

![BitX Config CLI](https://via.placeholder.com/150) <!-- Replace with actual logo -->

[![Crates.io](https://img.shields.io/crates/v/bitx-config.svg)](https://crates.io/crates/bitx-config)
[![Documentation](https://docs.rs/bitx-config/badge.svg)](https://docs.rs/bitx-config)
[![Build Status](https://github.com/bitx-sh/config/workflows/CI/badge.svg)](https://github.com/bitx-sh/config/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful, extensible configuration management CLI with schema validation and plugin system.

[Documentation](https://docs.rs/bitx-config) |
[Crates.io](https://crates.io/crates/bitx-config) |
[Examples](./examples) |
[Contributing](./CONTRIBUTING.md)

</div>

## Features

- 🚀 **High Performance**: Built in Rust for maximum speed and efficiency
- 🔧 **Schema Validation**: Support for JSON Schema, TypeScript, and YAML schemas
- 🔌 **Plugin System**: Extensible architecture with official and community plugins
- 📦 **Multiple Formats**: Support for JSON, YAML, TOML, and custom formats
- 🔄 **Configuration Migration**: Tools for migrating between different versions and formats
- 📚 **Documentation Generation**: Automatic documentation generation from schemas
- 🔍 **Type Safety**: Strong type checking and validation
- 🎨 **Interactive Mode**: User-friendly interactive configuration setup

## Quick Start

### Installation

```bash
# Install via Cargo
cargo install bitx-config

# Or build from source
git clone https://github.com/bitx-sh/config
cd config
cargo install --path .
```

### Basic Usage

```bash
# Initialize a new configuration
bitx init --type biome

# Validate existing configuration
bitx validate --config ./bitx.config.json

# Generate documentation
bitx docs --config ./bitx.config.json --output ./docs

# Migrate configuration
bitx migrate --from v1 --to v2 --config ./bitx.config.json
```

## Configuration Examples

### JSON Configuration
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "schema": {
    "type": "json-schema",
    "content": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "version": { "type": "string" }
      }
    }
  }
}
```

### YAML Configuration
```yaml
name: my-project
version: 1.0.0
schema:
  type: yaml
  content:
    type: object
    properties:
      name:
        type: string
      version:
        type: string
```

## Plugin System

BitX Config supports a powerful plugin system for extending functionality:

### Official Plugins

- `bitx-plugin-biome`: Biome configuration management
- `bitx-plugin-vite`: Vite configuration generation
- `bitx-plugin-github`: GitHub Actions workflow management
- `bitx-plugin-renovate`: Renovate bot configuration
- `bitx-plugin-docker`: Docker configuration management

### Creating Custom Plugins

```rust
use bitx_core::{Plugin, Config, Template, Result};
use async_trait::async_trait;

#[derive(Default)]
pub struct MyCustomPlugin {
    name: String,
    version: String,
}

#[async_trait]
impl Plugin for MyCustomPlugin {
    fn name(&self) -> &str {
        &self.name
    }

    fn version(&self) -> &str {
        &self.version
    }

    async fn setup(&self) -> Result<()> {
        // Plugin setup logic
        Ok(())
    }

    async fn validate(&self, config: &Config) -> Result<()> {
        // Validation logic
        Ok(())
    }
}
```

## Schema Validation

BitX Config supports multiple schema formats and validation strategies:

### Supported Schema Formats

- JSON Schema
- TypeScript
- YAML
- Custom formats via plugins

### Validation Features

- Type checking
- Pattern matching
- Custom validators
- Reference validation
- Conditional validation
- Format validation

## Configuration Migration

Built-in tools for migrating configurations between versions:

```bash
# Migrate from v1 to v2
bitx migrate --from v1 --to v2 --config ./config.json

# Convert between formats
bitx migrate --from json --to yaml --config ./config.json
```

## Documentation Generation

Automatically generate documentation from your schemas:

```bash
# Generate full documentation
bitx docs --config ./config.json --output ./docs

# Generate specific format
bitx docs --config ./config.json --format markdown --output README.md
```

## Development

### Prerequisites

- Rust 1.70 or higher
- Cargo
- Git

### Building from Source

```bash
# Clone the repository
git clone https://github.com/bitx-sh/config
cd config

# Build the project
cargo build --release

# Run tests
cargo test --all-features

# Run specific test suite
cargo test --package bitx-core
```

### Project Structure

```
bitx-config/
├── crates/
│   ├── bitx-core/          # Core functionality
│   ├── bitx-plugin-biome/  # Biome plugin
│   ├── bitx-plugin-vite/   # Vite plugin
│   ├── bitx-plugin-github/ # GitHub plugin
│   └── bitx-plugin-renovate/ # Renovate plugin
├── examples/               # Usage examples
├── tests/                 # Integration tests
├── docs/                  # Documentation
└── scripts/              # Development scripts
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Write tests
5. Submit a pull request

### Code Style

We follow the standard Rust code style and use the following tools:

- `rustfmt` for code formatting
- `clippy` for linting
- `cargo deny` for dependency checking

## Performance

BitX Config is designed for performance:

- Lazy loading of plugins
- Schema validation caching
- Efficient memory usage
- Parallel processing where applicable

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- The Rust community
- Contributors and maintainers
- Users who provide feedback and suggestions

## Support

- [GitHub Issues](https://github.com/bitx-sh/config/issues)
- [Discord Community](https://discord.gg/bitx-config)
- [Documentation](https://docs.rs/bitx-config)

## Roadmap

### Phase 1 (Current)
- [x] Core CLI functionality
- [x] Basic schema validation
- [x] Plugin system foundation
- [ ] Initial documentation generation

### Phase 2
- [ ] Advanced schema validation
- [ ] More official plugins
- [ ] Configuration migration tools
- [ ] Performance optimizations

### Phase 3
- [ ] Web interface
- [ ] Cloud integration
- [ ] Real-time validation
- [ ] Collaborative features

## FAQ

### Q: How does BitX Config compare to other configuration tools?
A: BitX Config focuses on type safety, extensibility, and developer experience while maintaining high performance through its Rust implementation.

### Q: Can I use BitX Config in my existing project?
A: Yes! BitX Config is designed to work with existing projects and supports multiple configuration formats and migration paths.

### Q: How can I contribute to BitX Config?
A: Check out our [Contributing Guide](CONTRIBUTING.md) for detailed information on how to contribute.

## Related Projects

- [Biome](https://biomejs.dev)
- [Vite](https://vitejs.dev)
- [Renovate](https://renovatebot.com)

---

<div align="center">
Made with ❤️ by the BitX Config team
</div>
```