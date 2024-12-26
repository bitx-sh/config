import type { Plugin, BitXCore } from "./types";

export class PluginSystem {
  private plugins = new Map<string, Plugin>();
  private core: BitXCore;

  constructor(core: BitXCore) {
    this.core = core;
  }

  async load(name: string): Promise<void> {
    // Import plugin
    const plugin = await import(name);

    // Validate plugin
    this.validatePlugin(plugin);

    // Initialize plugin
    await plugin.setup(this.createContext());

    // Store plugin
    this.plugins.set(name, plugin);
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getForSchema(schema: Schema): Plugin | undefined {
    return Array.from(this.plugins.values()).find((plugin) =>
      plugin.supportsSchema(schema),
    );
  }

  private validatePlugin(plugin: any): void {
    if (!plugin.name || !plugin.setup) {
      throw new Error("Invalid plugin: missing required fields");
    }
  }

  private createContext() {
    return {
      core: this.core,
      logger: this.core.logger,
      config: this.core.config,
    };
  }
}
